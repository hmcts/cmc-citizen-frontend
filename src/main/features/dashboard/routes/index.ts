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
import { formPaginationToDisplay } from '../helpers/paginationBuilder'
import { Logger } from '@hmcts/nodejs-logging'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const logger = Logger.getLogger('router/dashboards')

function renderPage (res: express.Response, claimParams: object) {
  res.render(Paths.dashboardPage.associatedView, claimParams)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dashboardPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {

    const claimDraft: Draft<DraftClaim> = res.locals.claimDraft
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    const userEmail: string = user.email
    const claimDraftSaved: boolean = claimDraft.document && claimDraft.id !== 0
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0
    const launchDarklyClient = new LaunchDarklyClient()
    const featureToggles = new FeatureToggles(launchDarklyClient)
    let paginationArgumentClaimant: object = undefined
    let paginationArgumentDefendant: object = undefined

    if (await featureToggles.isDashboardPaginationEnabled()) {
      logger.info('Dashboard feature is enabled')
      const selectedPIdByClaimant: number = (req.query.c_pid === undefined || req.query.c_pid === '') ? 1 : Number(req.query.c_pid)
      const selectedPIdByDefendant: number = (req.query.d_pid === undefined || req.query.d_pid === '') ? 1 : Number(req.query.d_pid)
      const pagingInfoClaimant = await claimStoreClient.retrievePaginationInfo(user, ActorType.CLAIMANT)
      const pagingInfoDefendant = await claimStoreClient.retrievePaginationInfo(user, ActorType.DEFENDANT)
      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, selectedPIdByClaimant)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, selectedPIdByDefendant)

      if (pagingInfoClaimant !== undefined && selectedPIdByClaimant !== undefined && pagingInfoClaimant['totalPages'] > 1) {
        paginationArgumentClaimant = formPaginationToDisplay(pagingInfoClaimant, selectedPIdByClaimant , ActorType.CLAIMANT)
      }

      if (pagingInfoDefendant !== undefined && selectedPIdByDefendant !== undefined && pagingInfoDefendant['totalPages'] > 1) {
        paginationArgumentDefendant = formPaginationToDisplay(pagingInfoDefendant, selectedPIdByDefendant, ActorType.DEFENDANT)
      }

      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, {
        claimsAsClaimant: claimsAsClaimant,
        claimDraftSaved: claimDraftSaved,
        claimsAsDefendant: claimsAsDefendant,
        responseDraftSaved: responseDraftSaved,
        paginationArgumentClaimant: paginationArgumentClaimant,
        paginationArgumentDefendant: paginationArgumentDefendant,
        userEmail: userEmail
      })
    } else {
      logger.info('Dashboard feature is not enabled')
      const claimsAsClaimant: Claim[] = await claimStoreClient.retrieveByClaimantId(user, undefined)
      const claimsAsDefendant: Claim[] = await claimStoreClient.retrieveByDefendantId(user, undefined)
      claimState(claimsAsClaimant,ActorType.CLAIMANT)
      claimState(claimsAsDefendant,ActorType.DEFENDANT)

      renderPage(res, {
        claimsAsClaimant: claimsAsClaimant,
        claimDraftSaved: claimDraftSaved,
        claimsAsDefendant: claimsAsDefendant,
        responseDraftSaved: responseDraftSaved,
        paginationArgumentClaimant: undefined,
        paginationArgumentDefendant: undefined,
        userEmail: userEmail})
    }

  }))
