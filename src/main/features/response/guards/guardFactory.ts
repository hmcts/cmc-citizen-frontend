import * as express from 'express'

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
}
