import { Request, Response, NextFunction } from 'express'
import { Logger } from '@hmcts/nodejs-logging'
import * as HttpStatus from 'http-status-codes'

const logger = Logger.getLogger('routes-logger.ts')

export function logRoutes(req: Request, res: Response, next: NextFunction): void {

  if (
    !res.status(HttpStatus.ACCEPTED) ||
    !res.status(HttpStatus.CREATED) ||
    !res.status(HttpStatus.OK)
  ) {
    // Check specific status codes and log messages accordingly
    if (res.status(HttpStatus.MOVED_TEMPORARILY)) {
      logger.error('MOVED_TEMPORARILY: Temporary redirection occurred')
    } else if (res.status(HttpStatus.BAD_GATEWAY)) {
      logger.error('BAD_GATEWAY: Bad gateway')
    } else if (res.status(HttpStatus.FORBIDDEN)) {
      logger.error('FORBIDDEN: Forbidden access')
    } else if (res.status(HttpStatus.NOT_FOUND)) {
      logger.error('NOT_FOUND: Not found')
    } else if (res.status(HttpStatus.INTERNAL_SERVER_ERROR)) {
      logger.error('INTERNAL_SERVER_ERROR: Internal server error')
    }
  }
  next()
}
