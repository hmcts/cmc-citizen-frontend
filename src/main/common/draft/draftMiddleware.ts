import * as express from 'express'
import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftDocument, Draft } from 'models/draft'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import User from 'idam/user'

export class DraftMiddleware {

  static requestHandler<T extends DraftDocument> (draftType: string, deserializeFn: (value: any) => T = (value) => value): express.RequestHandler {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
      if (res.locals.isLoggedIn) {
        try {
          const client: DraftStoreClient<T> = await DraftStoreClientFactory.create<T>()

          const user: User = res.locals.user
          client
            .find(user.bearerToken, draftType, deserializeFn)
            .then((drafts: Draft<T>[]) => {
              const matchingDrafts = drafts.filter(item => item.type === draftType)

              if (matchingDrafts.length > 1) {
                throw new Error('More then one draft has been found')
              }

              if (matchingDrafts.length === 0) {
                const draft = new Draft<T>()
                draft.type = draftType
                draft.document = deserializeFn(undefined)
                res.locals.user[`${draftType}Draft`] = draft
              } else {
                res.locals.user[`${draftType}Draft`] = matchingDrafts[0]
              }

              next()
            })
            .catch(next)
        } catch (err) {
          next(err)
        }
      } else {
        next()
      }
    }
  }
}
