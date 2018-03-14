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

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const claimDraft: Draft<DraftClaim> = res.locals.claimDraft
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user)
    const claimDraftSaved: boolean = claimDraft.document && claimDraft.id !== 0
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0

    const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user)

    res.render(Paths.dashboardPage.associatedView, {
      paths: Paths,
      claimsAsClaimant: claimsAsClaimant,
      claimDraftSaved: claimDraftSaved,
      claimsAsDefendant: claimsAsDefendant,
      responseDraftSaved: responseDraftSaved,
      isAfter4pm: isAfter4pm()
    })
  }))
