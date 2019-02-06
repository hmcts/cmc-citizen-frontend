import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PartyType } from 'common/partyType'

function getPaymentIntention (draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  if (draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.NO) {
    return undefined
  }

  if (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept &&
    draft.acceptPaymentMethod.accept.option === YesNoOption.YES ||
    (draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.YES)) {
    return response.paymentIntention
  } else if (claim.response.defendant.type === PartyType.INDIVIDUAL.value) {
    return draft.courtDetermination.courtDecision
  } else {
    return draft.alternatePaymentMethod.toDomainInstance()
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim
      const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        totalAmount: AmountHelper.calculateTotalAmount(claim, res.locals.draft.document),
        paymentIntention: alreadyPaid ? undefined : getPaymentIntention(draft.document, claim),
        alreadyPaid: alreadyPaid,
        amount: alreadyPaid ? StatesPaidHelper.getAlreadyPaidAmount(claim) : undefined
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user
      await new ClaimStoreClient().saveClaimantResponse(claim, draft, user)
      await new DraftService().delete(draft.id, user.bearerToken)
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
