import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { ResponseDraft } from 'response/draft/responseDraft'

const deserialize = (value: any): ResponseDraft => {
  return new ResponseDraft().deserialize(value)
}

const middleware = new DraftMiddleware<ResponseDraft>('response', deserialize)

export class ResponseDraftMiddleware {

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
