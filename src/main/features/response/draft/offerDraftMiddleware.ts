import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { OfferDraft } from 'response/draft/offerDraft'

const deserialize = (value: any): OfferDraft => {
  return new OfferDraft().deserialize(value)
}

const middleware = new DraftMiddleware<OfferDraft>('offer', deserialize)

export class OfferDraftMiddleware {

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
