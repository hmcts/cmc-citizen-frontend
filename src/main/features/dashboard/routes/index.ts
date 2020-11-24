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

function renderPage (res: express.Response, claimsAsClaimant: Claim[], claimDraftSaved: boolean, claimsAsDefendant: Claim[], responseDraftSaved: boolean, pagingInfo: string[], paginationArgument: object) {
  res.render(Paths.dashboardPage.associatedView, {
    claimsAsClaimant: claimsAsClaimant,
    claimDraftSaved: claimDraftSaved,
    claimsAsDefendant: claimsAsDefendant,
    responseDraftSaved: responseDraftSaved,
    pagingInfo: pagingInfo,
    paginationArgument: paginationArgument

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
    let pagingInfo: string[] = []
    let paginationArgument: object = undefined
    let totalPagesforClaimant: number = undefined
    let totalClaimsforClaimant: number = undefined

    if (await featureToggles.isDashboardPaginationEnabled()) {
      const selectedPageNo = (req.query.page === undefined || req.query.page === '') ? 1 : req.query.page

      if (totalPagesforClaimant === undefined || pagingInfo.length === 0) {
        pagingInfo = await claimStoreClient.retrievePaginationInfo(user)
        totalPagesforClaimant = pagingInfo['totalPages']
        totalClaimsforClaimant = pagingInfo['totalClaims']
      }

      if ((totalPagesforClaimant !== undefined && totalPagesforClaimant > 1) && selectedPageNo !== undefined) {
        paginationArgument = formPaginationToDisplay(totalPagesforClaimant, selectedPageNo, totalClaimsforClaimant)
      }

      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, selectedPageNo)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, selectedPageNo)
      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, claimsAsClaimant, claimDraftSaved, claimsAsDefendant, responseDraftSaved, pagingInfo, paginationArgument)

    } else {
      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, undefined)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, undefined)
      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, claimsAsClaimant, claimDraftSaved, claimsAsDefendant, responseDraftSaved, pagingInfo, paginationArgument)
    }

  }))
