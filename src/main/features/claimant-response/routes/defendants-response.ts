import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { FeatureToggles } from 'utils/featureToggles'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

function renderView (res: express.Response, page: number): void {
  const claim: Claim = res.locals.claim
  const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)
  const dqsEnabled: boolean = ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')
  let directionsQuestionnaireEnabled = false

  if (FeatureToggles.isEnabled('directionsQuestionnaire') &&
    ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
    directionsQuestionnaireEnabled = true
  }
  res.render(Paths.defendantsResponsePage.associatedView, {
    claim: claim,
    page: page,
    alreadyPaid: alreadyPaid,
    dqsEnabled: dqsEnabled,
    partiallyPaid: alreadyPaid ? StatesPaidHelper.isAlreadyPaidLessThanAmount(claim) : undefined,
    directionsQuestionnaireEnabled: directionsQuestionnaireEnabled
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    (req: express.Request, res: express.Response) => {
      const page: number = 0
      renderView(res, page)
    }
  )
  .post(
    Paths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user
      const claim: Claim = res.locals.claim
      const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)

      if (req.body.action && req.body.action.showPage && !alreadyPaid) {
        const page: number = +req.body.action.showPage
        return renderView(res, page)
      }

      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
