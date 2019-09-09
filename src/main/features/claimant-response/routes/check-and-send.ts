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
import { ResponseType } from 'claims/models/response/responseType'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { FeatureToggles } from 'utils/featureToggles'
import { SignatureType } from 'common/signatureType'
import { Form } from 'forms/form'
import { StatementOfTruth } from 'claimant-response/form/models/statementOfTruth'
import { FormValidator } from 'forms/validation/formValidator'
import { DirectionsQuestionnaireHelper } from 'claimant-response/helpers/directionsQuestionnaireHelper'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

function getPaymentIntention (draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  if (draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.NO) {
    // claimant rejected a part admit, so no payment plan has been agreed at all
    return undefined
  }

  // both parties agree the amount
  if (draft.acceptPaymentMethod) {
    if (draft.acceptPaymentMethod.accept.option === YesNoOption.YES) {
      return response.paymentIntention
    }

    if (!draft.courtDetermination) {
      // the court calculator was not invoked, so the alternate plan must have been more lenient than the defendant's
      return draft.alternatePaymentMethod.toDomainInstance()
    }

    return draft.courtDetermination.courtDecision
  }

  // claimant was not asked to accept the payment method, so it must have been IMMEDIATELY
  return response.paymentIntention
}

function deserializerFunction (value: any): StatementOfTruth {
  return StatementOfTruth.fromObject(value)
}

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
  const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
  const directionsQuestionnaireDraft: Draft<DirectionsQuestionnaireDraft> = res.locals.directionsQuestionnaireDraft
  const claim: Claim = res.locals.claim
  const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)
  const paymentIntention: PaymentIntention = alreadyPaid || claim.response.responseType === ResponseType.FULL_DEFENCE ? undefined : getPaymentIntention(draft.document, claim)
  const mediationPilot: boolean = ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot')
  const dqsEnabled: boolean = DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft.document, claim)
  const dispute: boolean = claim.response.responseType === ResponseType.FULL_DEFENCE
  let datesUnavailable: string[]
  if (dqsEnabled) {
    datesUnavailable = directionsQuestionnaireDraft.document.availability.unavailableDates.map(date => date.toMoment().format('LL'))
  }

  form.model.type = dqsEnabled ? SignatureType.DIRECTION_QUESTIONNAIRE : form.model.type

  res.render(Paths.checkAndSendPage.associatedView, {
    draft: draft.document,
    claim: claim,
    form: form,
    totalAmount: AmountHelper.calculateTotalAmount(claim, res.locals.draft.document),
    paymentIntention: paymentIntention,
    alreadyPaid: alreadyPaid,
    amount: alreadyPaid ? StatesPaidHelper.getAlreadyPaidAmount(claim) : undefined,
    mediationEnabled: FeatureToggles.isEnabled('mediation'),
    directionsQuestionnaireEnabled: dqsEnabled,
    mediationDraft: mediationDraft.document,
    contactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft.document),
    contactNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft.document),
    directionsQuestionnaireDraft: directionsQuestionnaireDraft.document,
    datesUnavailable: datesUnavailable,
    dispute: dispute,
    mediationPilot: mediationPilot
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form = new Form(new StatementOfTruth())
      renderView(form, res)
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<StatementOfTruth> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user
        const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft
        const draftService = new DraftService()

        await new ClaimStoreClient().saveClaimantResponse(claim, draft, mediationDraft, user, directionsQuestionnaireDraft.document)
        await new DraftService().delete(draft.id, user.bearerToken)

        if (DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft.document, claim) && directionsQuestionnaireDraft.id) {
          await draftService.delete(directionsQuestionnaireDraft.id, user.bearerToken)
        }
        if (claim.response.responseType !== ResponseType.FULL_ADMISSION && mediationDraft.id) {
          await draftService.delete(mediationDraft.id, user.bearerToken)
        }
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
