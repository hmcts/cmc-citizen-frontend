import * as express from 'express'

import { ResponseDraft } from 'response/draft/responseDraft'
import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import User from 'idam/user'

export class ResponseDraftMiddleware {

  static async save (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<ResponseDraft> = await DraftStoreClientFactory.create<ResponseDraft>()
    const user: User = res.locals.user
    return client.save(user.responseDraft, user.bearerToken)
  }

  static async delete (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<ResponseDraft> = await DraftStoreClientFactory.create<ResponseDraft>()
    const user: User = res.locals.user
    return client.delete(user.responseDraft, user.bearerToken)
  }
}
