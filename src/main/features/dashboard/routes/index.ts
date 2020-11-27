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
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { FeatureToggles } from 'utils/featureToggles'
import { formPaginationToDisplay } from '../helpers/formPagination'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

function renderPage (res: express.Response, claimsAsClaimant: Claim[], claimDraftSaved: boolean, claimsAsDefendant: Claim[], responseDraftSaved: boolean, paginationArgument_claimant: object, paginationArgument_defendant: object) {
  res.render(Paths.dashboardPage.associatedView, {
    claimsAsClaimant: claimsAsClaimant,
    claimDraftSaved: claimDraftSaved,
    claimsAsDefendant: claimsAsDefendant,
    responseDraftSaved: responseDraftSaved,
    paginationArgument_claimant: paginationArgument_claimant,
    paginationArgument_defendant: paginationArgument_defendant
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {

    const claimDraft: Draft<DraftClaim> = res.locals.claimDraft
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    const claimDraftSaved: boolean = claimDraft.document && claimDraft.id !== 0
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0
    const launchDarklyClient = new LaunchDarklyClient()
    const featureToggles = new FeatureToggles(launchDarklyClient)
    let paginationArgument_claimant: object = undefined
    let paginationArgument_defendant: object = undefined

    if (await featureToggles.isDashboardPaginationEnabled()) {
      const selectedPId_claimant: number = (req.query.c_pid === undefined || req.query.c_pid === '') ? 1 : parseInt(req.query.c_pid)
      const selectedPId_defendant: number = (req.query.d_pid === undefined || req.query.d_pid === '') ? 1 : parseInt(req.query.d_pid)
      const pagingInfo_claimant = await claimStoreClient.retrievePaginationInfo(user, ActorType.CLAIMANT)
      const pagingInfo_defendant = await claimStoreClient.retrievePaginationInfo(user, ActorType.DEFENDANT)

      if (pagingInfo_claimant !== undefined  && selectedPId_claimant !== undefined && pagingInfo_claimant['totalPages'] > 1) {
        paginationArgument_claimant = formPaginationToDisplay(pagingInfo_claimant, selectedPId_claimant , ActorType.CLAIMANT)
      }

      if (pagingInfo_defendant !== undefined && selectedPId_defendant !== undefined && pagingInfo_defendant['totalPages'] > 1) {
        paginationArgument_defendant = formPaginationToDisplay(pagingInfo_defendant, selectedPId_defendant, ActorType.DEFENDANT)
      }

      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, selectedPId_claimant)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, selectedPId_defendant)
      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, claimsAsClaimant, claimDraftSaved, claimsAsDefendant, responseDraftSaved, paginationArgument_claimant, paginationArgument_defendant)
    } else {
      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, undefined)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, undefined)
      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, claimsAsClaimant, claimDraftSaved, claimsAsDefendant, responseDraftSaved, undefined, undefined)
    }

  }))
