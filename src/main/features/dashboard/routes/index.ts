import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { User } from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { isAfter4pm } from 'common/dateUtils'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: User = res.locals.user
    const claimsAsClaimant: Claim[] = await ClaimStoreClient.retrieveByClaimantId(user.id)
    const claimDraftSaved: boolean = user.claimDraft.document && user.claimDraft.id !== 0
    const responseDraftSaved = user.responseDraft && user.responseDraft.document && user.responseDraft.id !== 0 // TODO: apply response draft middleware

    const claimsAsDefendant: Claim[] = await ClaimStoreClient.retrieveByDefendantId(user.id)

    res.render(Paths.dashboardPage.associatedView, {
      paths: Paths,
      claimsAsClaimant: claimsAsClaimant,
      claimDraftSaved: claimDraftSaved,
      claimsAsDefendant: claimsAsDefendant,
      responseDraftSaved: responseDraftSaved,
      isAfter4pm: isAfter4pm()
    })
  }))
