import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { claimState } from 'dashboard/claims-state-machine/claim-state'
import { ActorType } from 'claims/models/claim-states/actor-type'
import { FeatureToggles } from 'utils/featureToggles'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const claimDraft: Draft<DraftClaim> = res.locals.claimDraft
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user)
      // temporarily hide HWF claims until we know what to do on the dashboard for them
      .then(claims => claims.filter(claim => !!claim.claimNumber))
    const claimDraftSaved: boolean = claimDraft.document && claimDraft.id !== 0
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0
    const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user)

    if (FeatureToggles.isEnabled('newDashboardStatus')) {
      claimState(claimsAsClaimant, ActorType.CLAIMANT)
      claimState(claimsAsDefendant, ActorType.DEFENDANT)
    }

    res.render(Paths.dashboardPage.associatedView, {
      claimsAsClaimant,
      claimDraftSaved,
      claimsAsDefendant,
      responseDraftSaved
    })
  }))
