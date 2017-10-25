import * as express from 'express'

import { UUIDUtils } from 'common/utils/uuidUtils'
import { Draft } from '@hmcts/draft-store-client/dist/draft/draft'
import { DraftService } from 'services/DraftService'
import { DraftDocument } from 'models/draftDocument'

/**
 * Filters list of drafts to return only these matching external ID. If none of the drafts has external ID set
 * then unchanged list is returned so that they can be migrated to new format with external ID (legacy drafts scenario).
 */
function tryFilterByExternalId<T extends DraftDocument> (drafts: Draft<T>[], externalId: string): Draft<T>[] {
  if (drafts.filter(draft => draft.document.externalId !== undefined).length === 0) {
    return drafts
  }

  return drafts.filter(item => item.document.externalId === externalId)
}

export class DraftMiddleware {

  static requestHandler<T extends DraftDocument> (draftType: string, deserializeFn: (value: any) => T = (value) => value): express.RequestHandler {
    const draftService = new DraftService()

    return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
      if (res.locals.isLoggedIn) {
        try {
          draftService.find(draftType, '100', res.locals.user.bearerToken, deserializeFn)
            .then((drafts: Draft<T>[]) => {
              // req.params isn't populated here https://github.com/expressjs/express/issues/2088
              const externalId: string = UUIDUtils.extractFrom(req.path)

              if (externalId !== undefined) {
                drafts = tryFilterByExternalId(drafts, externalId)
              }

              if (drafts.length > 1) {
                throw new Error('More then one draft has been found')
              }

              let draft: Draft<T>
              if (drafts.length === 1) {
                draft = drafts[0]
              } else {
                draft = new Draft<T>(undefined, draftType, deserializeFn(undefined), undefined, undefined)
              }

              if (draft.document.externalId === undefined && externalId !== undefined) {
                draft.document.externalId = externalId
              }
              res.locals.user[`${draftType}Draft`] = draft

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
