import dayjs from 'dayjs'
import { SignJWT } from 'jose'
import sanitize from 'mongo-sanitize'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import clientPromise from '../../../lib/mongodb'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_ALG = 'HS256'

type ResponseData = {
  uid?: string
  token?: string
  error?: string
}

const bodySchema = z
  .object({
    uid: z.string().uuid().optional(),
  })
  .strict()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Run the cors middleware
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  if (req.method === 'POST') {
    if ('body' in req) {
      const body = bodySchema.safeParse(req.body)

      if (!body.success) {
        console.log(body.error)

        res.status(400).json({ error: 'The provided request body is invalid.' })
        return
      }

      const uid = sanitize(body.data.uid || uuidv4())
      const timestamp = dayjs().unix()

      const token = await new SignJWT({
        uid,
        timestamp,
      })
        .setProtectedHeader({ alg: JWT_ALG })
        .setIssuedAt()
        .sign(JWT_SECRET)

      const data = {
        uid,
        token,
      }

      const query = {
        uid,
      }

      // check if user exists
      const user = await db.collection('users').findOne(query)

      if (!user) {
        // create user
        await db.collection('users').insertOne({ uid })
      }

      res.status(201).json(data)

      return
    } else {
      res.status(400).json({ error: 'Invalid request' })

      return
    }
  } else {
    res.status(405).end()

    return
  }
}
