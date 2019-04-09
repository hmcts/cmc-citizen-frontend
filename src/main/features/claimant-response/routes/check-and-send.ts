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
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { ResponseType } from 'claims/models/response/responseType'
import { Organisation } from 'claims/models/details/yours/organisation'

function getPaymentIntention (draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  let result: PaymentIntention
  if (draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.NO) {
    result = undefined

  } else if (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === YesNoOption.YES) {
    result = response.paymentIntention

  } else if (!draft.courtDetermination) {
    result = draft.alternatePaymentMethod.toDomainInstance()

  } else {
    result = draft.courtDetermination.courtDecision
  }
  return result
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const claim: Claim = res.locals.claim
      const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)
      const paymentIntention: PaymentIntention = alreadyPaid || claim.response.responseType === ResponseType.FULL_DEFENCE ? undefined : getPaymentIntention(draft.document, claim)
      const contactPerson: string = claim.claimData.claimant.isBusiness ? (claim.claimData.claimant as Organisation).contactPerson : undefined
      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        totalAmount: AmountHelper.calculateTotalAmount(claim, res.locals.draft.document),
        paymentIntention: paymentIntention,
        alreadyPaid: alreadyPaid,
        amount: alreadyPaid ? StatesPaidHelper.getAlreadyPaidAmount(claim) : undefined,
        mediationEnabled: FeatureToggles.isEnabled('mediation'),
        mediationDraft: mediationDraft.document,
        contactPerson: contactPerson
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const user: User = res.locals.user
      await new ClaimStoreClient().saveClaimantResponse(claim, draft, mediationDraft, user)
      await new DraftService().delete(draft.id, user.bearerToken)
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
