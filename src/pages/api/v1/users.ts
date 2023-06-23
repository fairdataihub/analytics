import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'
import NextCors from 'nextjs-cors'
import { v4 as uuidv4 } from 'uuid'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

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

      const data = {
        uid,
        token: uuidv4().replace(/-/g, ''),
      }

      const query = {
        uid,
      }

      /**
       * TODO: genrate a timstamp and store it in the user jwt
       */

      // check if user exists
      const user = await db.collection('users').findOne(query)

      if (user) {
        // update user
        await db.collection('users').updateOne(query, { $set: data })

        res.status(201).json(data)
      } else {
        // create user
        await db.collection('users').insertOne(data)

        res.status(201).json(data)

        return
      }
    } else {
      res.status(400).json({ error: 'Invalid request' })

      return
    }
  } else {
    res.status(405).end()

    return
  }
}
