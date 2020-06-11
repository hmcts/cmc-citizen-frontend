"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const freeMediation_1 = require("forms/models/freeMediation");
const featureToggles_1 = require("utils/featureToggles");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
class FreeMediationTask {
    static isWillYouTryMediationCompleted(mediationDraft) {
        return (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === freeMediation_1.FreeMediationOption.NO) ||
            (!!mediationDraft.youCanOnlyUseMediation &&
                mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === freeMediation_1.FreeMediationOption.YES);
    }
    static isYouCanOnlyUseMediationCompleted(mediationDraft) {
        return (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === freeMediation_1.FreeMediationOption.YES &&
            !!mediationDraft.youCanOnlyUseMediation);
    }
    static isMediationDisagreementCompleted(mediationDraft) {
        return !!mediationDraft.mediationDisagreement;
    }
    static isCanWeUseCompleted(mediationDraft) {
        return ((!!mediationDraft.canWeUse && !!mediationDraft.canWeUseCompany) ||
            (!!mediationDraft.canWeUse && mediationDraft.canWeUse.isCompleted()) ||
            (!!mediationDraft.canWeUseCompany && mediationDraft.canWeUseCompany.isCompleted()));
    }
    static isCompleted(mediationDraft, claim) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            return (!!mediationDraft.willYouTryMediation);
        }
        else if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot')) {
            return (this.isCanWeUseCompleted(mediationDraft) && this.isYouCanOnlyUseMediationCompleted(mediationDraft)) ||
                (this.isWillYouTryMediationCompleted(mediationDraft) && (this.isMediationDisagreementCompleted(mediationDraft)
                    || this.isYouCanOnlyUseMediationCompleted(mediationDraft)));
        }
        else {
            return (this.isYouCanOnlyUseMediationCompleted(mediationDraft)) || this.isWillYouTryMediationCompleted(mediationDraft);
        }
    }
}
exports.FreeMediationTask = FreeMediationTask;
