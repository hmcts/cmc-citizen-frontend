import * as express from 'express'

export class GuardFactory {

  static create (isAllowed: (res: express.Response, req?: express.Request) => boolean, accessDeniedCallback: (req: express.Request, res: express.Response) => void): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (isAllowed(res, req)) {
        next()
      } else {
        accessDeniedCallback(req, res)
      }
    }
  }
}
