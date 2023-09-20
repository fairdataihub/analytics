import dayjs from 'dayjs'
import { jwtVerify } from 'jose'
import sanitize from 'mongo-sanitize'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { z } from 'zod'

import clientPromise from '../../../lib/mongodb'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const bodySchema = z
  .object({
    aid: z.string().uuid(),
    category: z.string().min(1),
    action: z.string().min(1),
    status: z.union([z.literal('success'), z.literal('failure')]).optional(),
    label: z.string().min(1).optional(),
    data: z.record(z.unknown()).optional(),
  })
  .strict()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsAPIResponse>
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
      const headers = req.headers

      const authorization = headers.authorization as string

      const token = authorization.split(' ')[1]

      const decoded = await jwtVerify(token, JWT_SECRET)

      const uid = decoded.payload.uid as string

      const body = bodySchema.safeParse(req.body)

      if (!body.success) {
        console.log(body.error)

        res.status(400).json({ error: 'The provided body is invalid.' })
        return
      }

      const { aid, category, action, label, status, data } = sanitize(body.data)

      const eventDetails: EventsDatabaseEntry = {
        uid,
        aid,
        eventCategory: category,
        eventAction: action,
        timestamp: dayjs().unix(),
      }

      if (label) {
        eventDetails.eventLabel = label
      }

      if (status) {
        eventDetails.eventStatus = status
      }

      if (data) {
        eventDetails.eventData = data
      }

      /**
       * TODO: check if app exists (do this in a github action)
       */

      await db.collection('events').insertOne(eventDetails)

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
