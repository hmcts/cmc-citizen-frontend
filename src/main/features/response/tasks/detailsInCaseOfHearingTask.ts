import { ResponseDraft } from 'response/draft/responseDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

export class DetailsInCaseOfHearingTask {
  static isCompleted (responseDraft: ResponseDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): boolean {

    if (directionsQuestionnaireDraft.hearingLocation === '') {
      return false
    } else if (directionsQuestionnaireDraft.expertRequired.option !== undefined) {
      if (directionsQuestionnaireDraft.expertRequired.option.option === 'yes') {
        if (directionsQuestionnaireDraft.expertReports.declared && !directionsQuestionnaireDraft.expertReports.rows.length) {
          return false
        }
      } else if (!directionsQuestionnaireDraft.permissionForExpert.isCompleted()) {
        return false
      } else if (directionsQuestionnaireDraft.permissionForExpert.option.option === 'yes') {
        if (!directionsQuestionnaireDraft.expertEvidence.isCompleted()) {
          return false
        } else if (directionsQuestionnaireDraft.expertEvidence.expertEvidence.option === 'yes' && !directionsQuestionnaireDraft.whyExpertIsNeeded.isCompleted()) {
          return false
        }
      }
    }
    return !(directionsQuestionnaireDraft.selfWitness.option === undefined ||
      !directionsQuestionnaireDraft.otherWitnesses.isCompleted() ||
      !directionsQuestionnaireDraft.availability.isCompleted() ||
      (directionsQuestionnaireDraft.supportRequired.otherSupportSelected && !directionsQuestionnaireDraft.supportRequired.otherSupport.length) ||
      (directionsQuestionnaireDraft.supportRequired.languageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length) ||
      (directionsQuestionnaireDraft.supportRequired.signLanguageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length))
  }
}
