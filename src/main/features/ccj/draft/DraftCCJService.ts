import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { DraftCCJ } from 'ccj/draft/DraftCCJ'

const deserialize = (value: any): DraftCCJ => {
  return new DraftCCJ().deserialize(value)
}

const middleware = new DraftMiddleware<DraftCCJ>('ccj', deserialize)

export class DraftCCJService {

  static retrieve (req: express.Request, res: express.Response, next: express.NextFunction): void {
    middleware.retrieve(res, next)
  }

  static save (res: express.Response, next: express.NextFunction): Promise<void> {
    return middleware.save(res, next)
  }

  static delete (res: express.Response, next: express.NextFunction): Promise<void> {
    return middleware.delete(res, next)
  }
}
