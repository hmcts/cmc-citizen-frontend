import * as express from 'express'
import * as moment from 'moment'
import { DraftService } from './draftService'
import { Draft } from './draft'
import { Secrets } from './secrets'
import { DraftDocument } from './draftDocument'

class UUIDUtils {
  private static UUID_PATTERN = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/

  static extractFrom (value: string): string | undefined {
    const result = UUIDUtils.UUID_PATTERN.exec(value)
    return result ? result[0] : undefined
  }
}

function filterByExternalId<T extends DraftDocument> (drafts: Draft<T>[], externalId: string): Draft<T>[] {
  if (drafts.filter(draft => draft.document.externalId !== undefined).length === 0) {
    return drafts
  }
  return drafts.filter(item => item.document.externalId === externalId)
}

function draftIsMissingExternalId<T extends DraftDocument> (draft: Draft<T>): boolean {
  return draft.document !== undefined && draft.document.externalId === undefined
}

export class DraftMiddleware {
  static requestHandler<T extends DraftDocument> (
    draftService: DraftService,
    draftType: string,
    limit: number,
    deserializeFn: (value: any) => T = (value: any) => value,
    secrets?: Secrets
  ): express.RequestHandler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!res.locals.isLoggedIn) {
        return next()
      }
      try {
        let drafts = await draftService.find<T>(
          draftType, limit.toString(), res.locals.user.bearerToken, deserializeFn, secrets
        )
        const externalId = UUIDUtils.extractFrom(req.path)
        if (externalId !== undefined) {
          drafts = filterByExternalId(drafts, externalId)
        }
        let draft: Draft<T> = !drafts.length
          ? new Draft<T>(0, draftType, deserializeFn(undefined), moment(), moment())
          : drafts[0]
        if (drafts.length > 1) {
          for (let i = 1; i < drafts.length; i++) {
            if (draft.updated.isBefore(drafts[i].updated)) {
              draft = drafts[i]
            }
          }
        }
        if (draftIsMissingExternalId(draft) && externalId !== undefined) {
          draft.document.externalId = externalId
        }
        res.locals[`${draftType}Draft`] = draft
        next()
      } catch (err) {
        next(err)
      }
    }
  }
}
