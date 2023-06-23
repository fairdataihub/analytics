import dayjs from 'dayjs'
import { jwtVerify } from 'jose'
import sanitize from 'mongo-sanitize'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import requestIp from 'request-ip'
import { z } from 'zod'

import clientPromise from '../../../lib/mongodb'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const logLevels = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warning: 4,
  notice: 5,
  informational: 6,
  debug: 7,
}

/**
 * * Log Levels
 * 0 - Emergency (system is unusable)
 * 1 - Alert (action must be taken immediately)
 * 2 - Critical (critical conditions)
 * 3 - Error (error conditions)
 * 4 - Warning (warning conditions)
 * 5 - Notice (normal but significant condition)
 * 6 - Informational (informational messages)
 * 7 - Debug (debug-level messages)
 */

const bodySchema = z
  .object({
    aid: z.string().uuid(),
    level: z
      .union([
        z.literal('emergency'),
        z.literal('alert'),
        z.literal('critical'),
        z.literal('error'),
        z.literal('warning'),
        z.literal('notice'),
        z.literal('informational'),
        z.literal('debug'),
      ])
      .optional(),
    trace: z.string().min(1),
  })
  .strict()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogsAPIResponse>
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

      const { aid, level, trace } = sanitize(body.data)

      const logLevel = (level && logLevels[level]) || logLevels.debug

      const logDetails: LogsDatabaseEntry = {
        uid,
        aid,

        level: logLevel,
        trace,

        timestamp: dayjs().unix(),
      }

      const ipAddress = requestIp.getClientIp(req)

      if (ipAddress) {
        logDetails.ipAddress = ipAddress
      }

      /**
       * TODO: check if app exists (do this in a github action)
       */

      await db.collection('logs').insertOne(logDetails)

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
