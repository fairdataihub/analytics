import type { NextApiRequest, NextApiResponse } from 'next'

import NextCors from 'nextjs-cors'
import { z } from 'zod'
import dayjs from 'dayjs'
import requestIp from 'request-ip'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

type ResponseData = {
  version?: string
  error?: string
}

const bodySchema = z
  .object({
    uid: z.string().uuid(),
    aid: z.string().uuid(),
    category: z.string().min(1),
    action: z.string().min(1),
    status: z.string().min(1),
    data: z.record(z.object({})).optional(),
  })
  .strict()

const headersSchema = z.object({
  authorization: z.string().min(1),
})

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

      const uid = sanitizedBody.uid // user id
      const aid = sanitizedBody.aid // app id

      const eventCategory = sanitizedBody.category
      const eventAction = sanitizedBody.action
      const eventStatus = sanitizedBody.status
      const eventData = sanitizedBody.data

      const ipAddress = requestIp.getClientIp(req)

      /**
       * TODO: check if app exists (do this in a github action)
       */

      const data = {
        timestamp: dayjs().unix(),

        uid,
        aid,

        eventCategory,
        eventAction,
        eventStatus,

        eventData,

        ipAddress,
      }

      await db.collection('events').insertOne(data)

      res.status(201).end()

      return
    } else {
      res.status(400).json({ error: 'The provided body is invalid.' })

      return
    }
  } else {
    res.status(405).end()

    return
  }
}
