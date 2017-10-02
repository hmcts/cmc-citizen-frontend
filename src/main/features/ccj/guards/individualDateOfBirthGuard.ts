import * as express from 'express'

import { Paths } from 'dashboard/paths'

import { DraftCCJ } from 'ccj/draft/DraftCCJ'
import { PartyType } from 'app/common/partyType'

const logger = require('@hmcts/nodejs-logging').getLogger('claim/guards/allTasksCompletedGuard')

export class IndividualDateOfBirthGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const draft: DraftCCJ = res.locals.user.ccjDraft.document

    if (draft && draft.defendant && draft.defendant.partyDetails && draft.defendant.partyDetails.type === PartyType.INDIVIDUAL.value) {
      next()
    } else {
      logger.warn(`CCJ state guard: defendant date of birth is only available for individual defendants - redirecting to dashboard page`)
      res.redirect(Paths.dashboardPage.uri)
    }
  }
}
