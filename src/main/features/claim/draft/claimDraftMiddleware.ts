import * as express from 'express'

import DraftClaim from 'drafts/models/draftClaim'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import DraftStoreClient from 'common/draft/draftStoreClient'
import User from 'idam/user'

export class ClaimDraftMiddleware {

  static async save (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<DraftClaim> = await DraftStoreClientFactory.create<DraftClaim>()
    const user: User = res.locals.user
    return client.save(user.claimDraft, user.bearerToken)
  }

  static async delete (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<DraftClaim> = await DraftStoreClientFactory.create<DraftClaim>()
    const user: User = res.locals.user
    return client.delete(user.claimDraft, user.bearerToken)
  }
}
