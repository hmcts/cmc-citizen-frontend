import { ResponseType } from 'claims/models/response/responseType'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { FeatureToggles } from 'utils/featureToggles'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'

export class DirectionsQuestionnaireHelper {

  static isDirectionsQuestionnaireEligible (draft: DraftClaimantResponse,
                                                    claim: Claim): boolean {
    if (!(FeatureToggles.isEnabled('directionsQuestionnaire') &&
      ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire'))) {
      return false
    } else if (claim.response.responseType === ResponseType.FULL_DEFENCE && draft.intentionToProceed && draft.intentionToProceed.proceed.option === YesNoOption.YES) {
      return true
    } else if (StatesPaidHelper.isResponseAlreadyPaid(claim)) {
      if (claim.response.responseType === ResponseType.FULL_DEFENCE && draft.accepted && draft.accepted.accepted.option === YesNoOption.NO) {
        return true
      } else {
        if (StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)) {
          if ((draft.partPaymentReceived && draft.partPaymentReceived.received.option === YesNoOption.NO) || (draft.accepted && draft.accepted.accepted.option === YesNoOption.NO)) {
            return true
          }
        } else if (draft.accepted && draft.accepted.accepted.option === YesNoOption.NO) {
          return true
        }
      }
    } else if (claim.response.responseType === ResponseType.PART_ADMISSION && draft.settleAdmitted
      && draft.settleAdmitted.admitted.option === YesNoOption.NO) {
      return true
    }

    return false
  }
}
