import * as express from 'express'

import { DraftCCJ } from 'ccj/draft/DraftCCJ'
import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import User from 'idam/user'

export class DraftCCJService {

  static async save (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<DraftCCJ> = await DraftStoreClientFactory.create<DraftCCJ>()
    const user: User = res.locals.user
    return client.save(user.ccjDraft, user.bearerToken)
  }

  static async delete (res: express.Response, next: express.NextFunction): Promise<void> {
    const client: DraftStoreClient<DraftCCJ> = await DraftStoreClientFactory.create<DraftCCJ>()
    const user: User = res.locals.user
    return client.delete(user.ccjDraft, user.bearerToken)
  }
}
