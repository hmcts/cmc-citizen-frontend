import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftClaim from 'drafts/models/draftClaim'

const deserialize = (value: any): DraftClaim => {
  return new DraftClaim().deserialize(value)
}

const middleware = new DraftMiddleware<DraftClaim>('claim', deserialize)

export class ClaimDraftMiddleware {

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
