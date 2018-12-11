import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ClaimMiddleware } from 'claims/claimMiddleware'

const page = Paths.directionsQuestionnairePage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    ClaimMiddleware.retrieveByExternalId,
    (req: express.Request, res: express.Response): void => {
      const user: User = res.locals.user
      const claim: Claim = res.locals.claim

      res.render(page.associatedView, {
        deadline: claim.directionsQuestionnaireDeadline,
        claimNumber: claim.claimNumber,
        citizenName: user.forename + ' ' + user.surname
      })
    })
