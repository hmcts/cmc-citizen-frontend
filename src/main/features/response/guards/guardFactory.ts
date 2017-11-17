import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class GuardFactory {

  static create (isAllowed: (res: express.Response) => boolean, accessDeniedCallback: (req: express.Request, res: express.Response) => void): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (isAllowed(res)) {
        next()
      } else {
        accessDeniedCallback(req, res)
      }
    }
  }

  static createForFeatureToggle (feature: string, accessDeniedCallback: (req: express.Request, res: express.Response) => void): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (toBoolean(config.get<boolean>(feature))) {
        next()
      } else {
        accessDeniedCallback(req, res)
      }
    }
  }

}
