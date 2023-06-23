import sanitize from 'mongo-sanitize'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import clientPromise from '../../../lib/mongodb'

type ResponseData = {
  name?: string
  aid?: string
  error?: string
}

const bodySchema = z
  .object({
    name: z.string().min(1),
    aid: z.string().uuid().optional(),
  })
  .strict()

const querySchema = z
  .object({
    aid: z.string().uuid(),
  })
  .strict()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  if (req.method === 'GET') {
    const query = querySchema.safeParse(req.query)

    if (!query.success) {
      console.log(query.error)

      res.status(400).json({ error: 'The provided query is invalid.' })
      return
    }

    const aid = sanitize(query.data.aid)

    // get app object
    const app = await db
      .collection('apps')
      .findOne({ aid }, { projection: { _id: 0 } })

    if (!app) {
      res.status(404).json({ error: 'Requested app not found' })

      return
    } else {
      res.status(200).json(app)

      return
    }
  } else if (req.method === 'POST') {
    if ('body' in req) {
      const body = bodySchema.safeParse(req.body)

      if (!body.success) {
        console.log(body.error)

        res.status(400).json({ error: 'The provided request body is invalid.' })
        return
      }

      const appName = sanitize(body.data.name)

      const data = {
        name: appName,
        aid: uuidv4(),
      }

      // insert app
      await db.collection('apps').insertOne(data)

      res.status(201).json(data)

      return
    } else {
      res.status(400).json({ error: 'The provided request body is invalid.' })

      return
    }
  } else if (req.method === 'DELETE' && 'body' in req) {
    const body = bodySchema.safeParse(req.body)

    if (!body.success) {
      console.log(body.error)

      res.status(400).json({ error: 'The provided request body is invalid.' })
      return
    }

    const aid = sanitize(body.data.aid)

    const query = {
      aid,
    }

    // delete app
    await db.collection('apps').deleteOne(query)

    res.status(204).end()

    return
  } else if (req.method === 'PUT' && `body` in req) {
    const body = bodySchema.safeParse(req.body)

    if (!body.success) {
      console.log(body.error)

      res.status(400).json({ error: 'The provided request body is invalid.' })
      return
    }

    const aid = sanitize(body.data.aid)
    const appName = sanitize(body.data.name)

    const query = {
      aid,
    }

    const update = {
      $set: {
        name: appName,
      },
    }

    // get app object
    const app = await db
      .collection('apps')
      .findOne(query, { projection: { _id: 0 } })

    if (!app) {
      res.status(404).json({ error: 'Requested app not found' })

      return
    }

    // update app
    await db.collection('apps').updateOne(query, update)

    res.status(204).end()

    return
  }
}
