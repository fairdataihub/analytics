import type { NextApiRequest, NextApiResponse } from 'next'

import NextCors from 'nextjs-cors'
import dayjs from 'dayjs'
import requestIp from 'request-ip'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

type Data = {
  error?: string
}

type RequestBody = {
  uid?: string
  aid?: string
  trace?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the cors middleware
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  if (req.method === 'POST') {
    if ('body' in req) {
      const body = req.body as RequestBody

      if (!body.uid) {
        res.status(400).json({ error: 'uid is required' })
        return
      }

      if (!body.aid) {
        res.status(400).json({ error: 'aid is required' })
        return
      }

      const uid = sanitize(body.uid) // user id
      const aid = sanitize(body.aid) // app id

      const stackTrace = sanitize(body.trace || '')

      const client = await clientPromise
      const metadb = client.db('meta')
      const logsdb = client.db('logs')

      const ipAddress = requestIp.getClientIp(req)

      // verify user

      const user = await metadb.collection('users').findOne({
        uid,
      })

      if (!user) {
        res.status(400).end()
        return
      }

      // verify aid

      const app = await metadb.collection('apps').findOne({
        aid,
      })

      if (!app) {
        res.status(400).end()
        return
      }

      const data = {
        timestamp: dayjs().unix(),
        uid,
        stackTrace,
        ipAddress,
      }

      await logsdb.collection(aid).insertOne(data)

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
