import * as express from 'express'
import StringUtils from 'utils/stringUtils'

export function buildURL (req: express.Request, path: string, forceSSL: boolean = false): string {
  if (StringUtils.isBlank(path)) {
    throw new Error('Path null or undefined')
  }
  if (req === undefined) {
    throw new Error('Request is undefined')
  }
  const protocol = (forceSSL || req.secure) ? 'https://' : 'http://'
  const host = req.headers.host

  const baseURL: string = `${protocol}${host}`
  if (path.startsWith('/')) {
    return baseURL + path
  } else {
    return `${baseURL}/${path}`
  }
}
