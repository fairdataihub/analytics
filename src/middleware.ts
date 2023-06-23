import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in the environment variables.')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  console.log('Incoming request:', request.method, request.url)

  const headers = request.headers

  const authorization = headers.get('authorization')

  if (!authorization) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication failed.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  const token = authorization.split(' ')[1]

  try {
    const decoded = await jwtVerify(token, JWT_SECRET)

    const uid = decoded.payload.uid as string

    if (!uid) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication failed.' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }

    return NextResponse.next()
  } catch (err) {
    console.log(err)

    return new NextResponse(
      JSON.stringify({ error: 'Authentication failed.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/v1/logs',
}
