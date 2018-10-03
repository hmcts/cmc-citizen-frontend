import * as express from 'express'
import { StringUtils } from 'utils/stringUtils'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('applicationRunner')

export function buildURL (req: express.Request, path: string): string {

  logger.info('path: ' + path)
  logger.info('appContext: ' + process.env.APPLICATION_CONTEXT)
  logger.info('req.headers.host: ' + req.headers.host)
  logger.info('req.headers.location: ' + req.headers.location)

  if (StringUtils.isBlank(path)) {
    throw new Error('Path null or undefined')
  }

  if (req === undefined) {
    throw new Error('Request is undefined')
  }

  const protocol = 'https://'
  const host = req.headers.host
  const appContext = process.env.APPLICATION_CONTEXT || ''

  const baseURL: string = `${protocol}${host}`
  if (path.startsWith('/')) {
    return baseURL + appContext + path
  } else {
    return `${baseURL}/${appContext}/${path}`
  }
}
