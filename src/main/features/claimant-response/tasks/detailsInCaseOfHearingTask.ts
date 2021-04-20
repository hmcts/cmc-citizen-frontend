import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { YesNoOption } from 'models/yesNoOption'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

export class DetailsInCaseOfHearingTask {
  static isCompleted (responseDraft: DraftClaimantResponse, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft, claim: Claim): boolean {
    if (!claim.claimData.defendant.isBusiness() && !directionsQuestionnaireDraft.exceptionalCircumstances.isClaimantCompleted()) {
      return false
    } else if (!directionsQuestionnaireDraft.hearingLocation) {
      return false
    } else if (directionsQuestionnaireDraft.expertRequired.option !== undefined) {
      if (directionsQuestionnaireDraft.expertRequired.option.option === YesNoOption.YES.option) {
        if (directionsQuestionnaireDraft.expertReports.declared === undefined) {
          return false
        } else if (directionsQuestionnaireDraft.expertReports.declared.option === YesNoOption.YES.option && !directionsQuestionnaireDraft.expertReports.rows.length) {
          return false
        } else if (directionsQuestionnaireDraft.expertReports.declared.option === YesNoOption.NO.option) {
          if (!directionsQuestionnaireDraft.permissionForExpert.isCompleted()) {
            return false
          } else if (directionsQuestionnaireDraft.permissionForExpert.option.option === YesNoOption.YES.option) {
            if ((!directionsQuestionnaireDraft.expertEvidence.isCompleted()) || (directionsQuestionnaireDraft.expertEvidence.expertEvidence.option === YesNoOption.YES.option && !directionsQuestionnaireDraft.whyExpertIsNeeded.isCompleted())) {
              return false
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
      (directionsQuestionnaireDraft.supportRequired.signLanguageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length))
  }
}
