import { Draft } from '@hmcts/draft-store-client'
import * as express from 'express'
import { ResponseDraft } from 'response/draft/responseDraft'

import { GuardFactory } from 'response/guards/guardFactory'

import { Paths } from 'response/paths'
import { UUIDUtils } from 'shared/utils/uuidUtils'

export class StatementOfMeansStateGuard {
  /**
   * Guard checks whether Statement of Means is required.
   * If so it accepts request, otherwise it makes redirect to task list
   *
   * @returns {e.RequestHandler}
   */
  static requestHandler (): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      return draft.document.isResponseFullyAdmitted()
        && (draft.document.isResponseFullyAdmittedWithPayBySetDate() || draft.document.isResponseFullyAdmittedWithInstalments())
    }, (req: express.Request, res: express.Response): void => {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
    })
  }
}
