import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { InitialTransitions } from 'dashboard/claims-state-machine/initial-transitions'
import { FullAdmissionTransitions } from 'dashboard/claims-state-machine/full-admission-transitions'
import { FullAdmissionStates } from 'claims/models/claim-states/full-admission-states'

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

    claimsAsClaimant.forEach(function (eachClaim) {

      let claimantState = InitialTransitions(eachClaim)
      claimantState.findState(claimantState)

      if (claimantState.is(FullAdmissionStates.FULL_ADMISSION)) {
        claimantState = FullAdmissionTransitions(eachClaim)
        claimantState.findState(claimantState)
      }
      eachClaim.template = claimantState.getTemplate('claimant')
    })

    claimsAsDefendant.forEach(function (eachClaim) {
      let claimantState = InitialTransitions(eachClaim)

      claimantState.findState(claimantState)

      if (claimantState.is(FullAdmissionStates.FULL_ADMISSION)) {
        claimantState = FullAdmissionTransitions(eachClaim)
        claimantState.findState(claimantState)
      }
      eachClaim.template = claimantState.getTemplate('defendant')
    })

    res.render(Paths.dashboardPage.associatedView, {
      claimsAsClaimant: claimsAsClaimant,
      claimDraftSaved: claimDraftSaved,
      claimsAsDefendant: claimsAsDefendant,
      responseDraftSaved: responseDraftSaved
    })
  }))
