"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
class DetailsInCaseOfHearingTask {
    static isCompleted(responseDraft, directionsQuestionnaireDraft, claim) {
        if (!claim.claimData.defendant.isBusiness() && !directionsQuestionnaireDraft.exceptionalCircumstances.isClaimantCompleted()) {
            return false;
        }
        else if (!directionsQuestionnaireDraft.hearingLocation) {
            return false;
        }
        else if (directionsQuestionnaireDraft.expertRequired.option !== undefined) {
            if (directionsQuestionnaireDraft.expertRequired.option.option === yesNoOption_1.YesNoOption.YES.option) {
                if (directionsQuestionnaireDraft.expertReports.declared === undefined) {
                    return false;
                }
                else if (directionsQuestionnaireDraft.expertReports.declared.option === yesNoOption_1.YesNoOption.YES.option && !directionsQuestionnaireDraft.expertReports.rows.length) {
                    return false;
                }
                else if (directionsQuestionnaireDraft.expertReports.declared.option === yesNoOption_1.YesNoOption.NO.option) {
                    if (!directionsQuestionnaireDraft.permissionForExpert.isCompleted()) {
                        return false;
                    }
                    else if (directionsQuestionnaireDraft.permissionForExpert.option.option === yesNoOption_1.YesNoOption.YES.option) {
                        if (!directionsQuestionnaireDraft.expertEvidence.isCompleted()) {
                            return false;
                        }
                        else if (directionsQuestionnaireDraft.expertEvidence.expertEvidence.option === yesNoOption_1.YesNoOption.YES.option && !directionsQuestionnaireDraft.whyExpertIsNeeded.isCompleted()) {
                            return false;
                        }
                    }
                }
            }
        }
        return !(directionsQuestionnaireDraft.selfWitness.option === undefined ||
            !directionsQuestionnaireDraft.otherWitnesses.isCompleted() ||
            !directionsQuestionnaireDraft.availability.isCompleted() ||
            (directionsQuestionnaireDraft.supportRequired.otherSupportSelected && !directionsQuestionnaireDraft.supportRequired.otherSupport.length) ||
            (directionsQuestionnaireDraft.supportRequired.languageSelected && !directionsQuestionnaireDraft.supportRequired.languageInterpreted.length) ||
            (directionsQuestionnaireDraft.supportRequired.signLanguageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length));
    }
}
exports.DetailsInCaseOfHearingTask = DetailsInCaseOfHearingTask;
