import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { User } from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { isAfter4pm } from 'common/dateUtils'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { ResponseDraft } from 'response/draft/responseDraft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const claimDraft: Draft<DraftClaim> = res.locals.claimDraft
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    const claimsAsClaimant: Claim[] = await ClaimStoreClient.retrieveByClaimantId(user.id)
    const claimDraftSaved: boolean = claimDraft.document && claimDraft.id !== 0
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0 // TODO: apply response draft middleware

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
