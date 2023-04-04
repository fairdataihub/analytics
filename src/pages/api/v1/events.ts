import type { NextApiRequest, NextApiResponse } from 'next'

import NextCors from 'nextjs-cors'
import validator from 'validator'
import dayjs from 'dayjs'
import requestIp from 'request-ip'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

type Data = {
  version?: string
  error?: string
}

type RequestBody = {
  uid?: string
  aid?: string
  category?: string
  action?: string
  status?: string
  data?: string
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

      let authorization = req.headers.authorization

      if (!authorization) {
        res.status(401).json({ error: 'authorization  is required' })
        return
      }

      if (typeof authorization === 'string') {
        authorization = authorization.trim()
      } else {
        res.status(401).json({ error: 'authorization is not valid' })
        return
      }

      // check if space in the authorization header
      if (authorization.indexOf(' ') === -1) {
        res.status(401).json({ error: 'authorization is not valid' })
        return
      }

      const token = sanitize(authorization?.split(' ')[1])

      if (validator.isUUID(token, 4)) {
        res.status(401).json({ error: 'authorization is not valid' })
        return
      }

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

      const eventCategory = sanitize(body.category || '')
      const eventAction = sanitize(body.action || '')
      const eventStatus = sanitize(body.status || '')
      const eventData = sanitize(body.data || '')

      const client = await clientPromise
      const metadb = client.db('meta')
      const eventsdb = client.db('events')

      const ipAddress = requestIp.getClientIp(req)

      // verify user

      const user = await metadb.collection('users').findOne({
        uid,
      })

      if (!user) {
        res.status(400).end()
        return
      }

      if (user.token !== token) {
        res.status(401).end()
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
        eventCategory,
        eventAction,
        eventStatus,
        eventData,
        ipAddress,
      }

      await eventsdb.collection(aid).insertOne(data)

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
