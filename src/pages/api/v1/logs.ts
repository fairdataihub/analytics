import type { NextApiRequest, NextApiResponse } from 'next'

import NextCors from 'nextjs-cors'
import dayjs from 'dayjs'
import { z } from 'zod'
import requestIp from 'request-ip'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

type ResponseData = {
  error?: string
}

const headersSchema = z.object({
  authorization: z.string().min(1),
})

const bodySchema = z
  .object({
    uid: z.string().uuid(),
    aid: z.string().uuid(),
    trace: z.string(),
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
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  if (req.method === 'POST') {
    if ('body' in req) {
      const headers = headersSchema.safeParse(req.headers)

      if (!headers.success) {
        console.log(headers.error)

        res.status(401).json({ error: 'The provided headers are invalid.' })
        return
      }

      const authorization = headers.data.authorization

      /**
       * TODO: check if authorization is valid JWT
       */

      const body = bodySchema.safeParse(req.body)

      if (!body.success) {
        console.log(body.error)

        res.status(400).json({ error: 'The provided body is invalid.' })

        return
      }

      const sanitizedBody = sanitize(body.data)

      const uid = sanitize(sanitizedBody.uid) // user id
      const aid = sanitize(sanitizedBody.aid) // app id
      const trace = sanitize(sanitizedBody.trace)

      const ipAddress = requestIp.getClientIp(req)

      /**
       * TODO: check if app exists (do this in a github action)
       */

      const data = {
        timestamp: dayjs().unix(),

        uid,
        aid,

        trace,

        ipAddress,
      }

      await db.collection('logs').insertOne(data)

      res.status(201).end()

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
