import * as express from 'express'

export default class ErrorHandling {

  static apply (requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      try {
        return await requestHandler(req, res, next)
      } catch (err) {
        next(err)
      }
    }
  }

}
