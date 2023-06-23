import isLocalhost from 'is-localhost-ip'
import { NextApiRequest } from 'next'
import requestIp from 'request-ip'

const CLIENT_IP_HEADER = process.env.CLIENT_IP_HEADER

export function getIpAddress(req: NextApiRequest) {
  /**
   * * Custom header
   * HTTP header to check for the client's IP address. This is useful when you're behind a proxy that uses non-standard headers.
   */
  if (CLIENT_IP_HEADER && req.headers[CLIENT_IP_HEADER]) {
    return req.headers[CLIENT_IP_HEADER]
  }
  // Cloudflare
  else if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip']
  }

  return requestIp.getClientIp(req)
}

export async function getLocation(ip: string, req: NextApiRequest) {
  // Ignore local ips
  if (await isLocalhost(ip)) {
    return
  }

  if (req.headers['x-vercel-ip-country']) {
    const country = req.headers['x-vercel-ip-country']
    const region = req.headers['x-vercel-ip-country-region']
    const city = req.headers['x-vercel-ip-city'] as string

    return {
      country,
      subdivision1: region,
      city: city ? decodeURIComponent(city) : undefined,
    }
  }
}

export async function getClientInfo(req: NextApiRequest) {
  const ip = getIpAddress(req) as string

  const location = await getLocation(ip, req)

  const country = location?.country
  const subdivision1 = location?.subdivision1

  const city = location?.city

  return { ip, country, subdivision1, city }
}
