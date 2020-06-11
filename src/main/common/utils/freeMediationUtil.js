"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("main/app/claims/models/response/core/yesNoOption");
const freeMediation_1 = require("main/app/forms/models/freeMediation");
const featureToggles_1 = require("utils/featureToggles");
class FreeMediationUtil {
    static getFreeMediation(mediationDraft) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation') && mediationDraft.willYouTryMediation) {
            return mediationDraft.willYouTryMediation.option;
        }
        else {
            const freeMediation = mediationDraft.youCanOnlyUseMediation;
            if (!freeMediation || !freeMediation.option) {
                return yesNoOption_1.YesNoOption.NO;
            }
            else {
                return freeMediation.option;
            }
        }
    }
    static getMediationPhoneNumber(claim, mediationDraft, draft) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            return undefined;
        }
        else if (mediationDraft.canWeUseCompany) {
            if (mediationDraft.canWeUseCompany.option === freeMediation_1.FreeMediationOption.YES) {
                return mediationDraft.canWeUseCompany.mediationPhoneNumberConfirmation;
            }
            else {
                return mediationDraft.canWeUseCompany.mediationPhoneNumber;
            }
        }
        else if (mediationDraft.canWeUse) {
            if (mediationDraft.canWeUse.option === freeMediation_1.FreeMediationOption.YES) {
                if (!claim.isResponseSubmitted() && draft) {
                    return draft.defendantDetails.phone.number || undefined;
                }
                else {
                    return claim.claimData.claimant.phone || mediationDraft.canWeUse.mediationPhoneNumber;
                }
            }
            else {
                return mediationDraft.canWeUse.mediationPhoneNumber;
            }
        }
        return undefined;
    }
    static getMediationContactPerson(claim, mediationDraft, draft) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            return undefined;
        }
        else if (mediationDraft.canWeUseCompany) {
            if (mediationDraft.canWeUseCompany.option === freeMediation_1.FreeMediationOption.YES) {
                if (!claim.isResponseSubmitted() && draft) {
                    return draft.defendantDetails.partyDetails.contactPerson || undefined;
                }
                else {
                    return claim.claimData.claimant.contactPerson;
                }
            }
            else {
                return mediationDraft.canWeUseCompany.mediationContactPerson;
            }
        }
        return undefined;
    }
}
exports.FreeMediationUtil = FreeMediationUtil;
