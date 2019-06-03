import { ResponseDraft } from 'response/draft/responseDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

export class DetailsInCaseOfHearingTask {
  static isCompleted (responseDraft: ResponseDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): boolean {

    if (directionsQuestionnaireDraft.hearingLocation === '') {
      return false
    } else if (directionsQuestionnaireDraft.expertRequired.option !== undefined) {
      if (directionsQuestionnaireDraft.expertRequired.option === 'yes') {
        if (directionsQuestionnaireDraft.expertReports.declared && !directionsQuestionnaireDraft.expertReports.rows.length) {
          return false
        }
      } else if (directionsQuestionnaireDraft.permissionForExpert.requestPermissionForExpert === undefined) {
        return false
      }
    }
    return !(directionsQuestionnaireDraft.selfWitness.option === undefined ||
      directionsQuestionnaireDraft.otherWitnesses.otherWitnesses.option === undefined ||
      (directionsQuestionnaireDraft.otherWitnesses.otherWitnesses.option === 'yes' && directionsQuestionnaireDraft.otherWitnesses.howMany === undefined) ||
      (directionsQuestionnaireDraft.availability.hasUnavailableDates && !directionsQuestionnaireDraft.availability.unavailableDates.length) ||
      (directionsQuestionnaireDraft.supportRequired.otherSupportSelected && !directionsQuestionnaireDraft.supportRequired.otherSupport.length) ||
      (directionsQuestionnaireDraft.supportRequired.languageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length) ||
      (directionsQuestionnaireDraft.supportRequired.signLanguageSelected && !directionsQuestionnaireDraft.supportRequired.signLanguageInterpreted.length))
  }
}
