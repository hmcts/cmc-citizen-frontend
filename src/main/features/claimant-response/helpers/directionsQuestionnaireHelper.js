"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("claims/models/response/responseType");
const featureToggles_1 = require("utils/featureToggles");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
class DirectionsQuestionnaireHelper {
    static isDirectionsQuestionnaireEligible(draft, claim) {
        if (!(featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') &&
            claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire'))) {
            return false;
        }
        else if (claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && draft.intentionToProceed && draft.intentionToProceed.proceed.option === yesNoOption_1.YesNoOption.YES) {
            return true;
        }
        else if (statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)) {
            if (claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && draft.accepted && draft.accepted.accepted.option === yesNoOption_1.YesNoOption.NO) {
                return true;
            }
            else {
                if (statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)) {
                    if (draft.partPaymentReceived && draft.partPaymentReceived.received.option === yesNoOption_1.YesNoOption.NO) {
                        return true;
                    }
                    else if (draft.accepted && draft.accepted.accepted.option === yesNoOption_1.YesNoOption.NO) {
                        return true;
                    }
                }
                else if (draft.accepted && draft.accepted.accepted.option === yesNoOption_1.YesNoOption.NO) {
                    return true;
                }
            }
        }
        else if (claim.response.responseType === responseType_1.ResponseType.PART_ADMISSION && draft.settleAdmitted
            && draft.settleAdmitted.admitted.option === yesNoOption_1.YesNoOption.NO) {
            return true;
        }
        return false;
    }
}
exports.DirectionsQuestionnaireHelper = DirectionsQuestionnaireHelper;
