import { Draft } from '@hmcts/draft-store-client'
import * as express from 'express'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

import { GuardFactory } from 'response/guards/guardFactory'
import { StatementOfMeansFeature } from 'response/helpers/statementOfMeansFeature'

import { Paths } from 'response/paths'
import { UUIDUtils } from 'shared/utils/uuidUtils'

export class StatementOfMeansStateGuard {
  /**
   * Guard checks whether Statement of Means is required.
   * If so it accepts request, otherwise it makes redirect to task list
   *
   * @returns {e.RequestHandler}
   */
  static requestHandler (requireInitiatedModel: boolean = true): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const claim: Claim = res.locals.claim

      return StatementOfMeansFeature.isApplicableFor(claim, draft.document)
        && (requireInitiatedModel ? draft.document.statementOfMeans !== undefined : true)
    }, (req: express.Request, res: express.Response): void => {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
    })
  }
}
