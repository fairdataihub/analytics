import type { NextApiRequest, NextApiResponse } from 'next'

import NextCors from 'nextjs-cors'
import { v4 as uuidv4 } from 'uuid'
import validator from 'validator'
import sanitize from 'mongo-sanitize'

import clientPromise from '../../../lib/mongodb'

type Data = {
  uid?: string
  token?: string
  error?: string
}

type RequestBody = {
  uid?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the cors middleware
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  if (req.method === 'POST') {
    if ('body' in req) {
      const body = req.body as RequestBody

      if (!body.uid) {
        res.status(400).json({ error: 'uid is required' })
        return
      }

      const uid = sanitize(body.uid)

      if (!validator.isUUID(uid, 4)) {
        res.status(400).json({ error: 'uid is not a valid uuid' })
        return
      }

      const client = await clientPromise
      const db = client.db('meta')

      const data = {
        uid,
        token: uuidv4().replace(/-/g, ''),
      }

      const query = {
        uid,
      }

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
      }
    } else {
      res.status(400).json({ error: 'Invalid request' })
    }
    return
  } else {
    res.status(404).end()
    return
  }
}
