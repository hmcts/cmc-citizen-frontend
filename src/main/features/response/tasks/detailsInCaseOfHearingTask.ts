import { ResponseDraft } from 'response/draft/responseDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { YesNoOption } from 'models/yesNoOption'

export class DetailsInCaseOfHearingTask {
  static isCompleted (responseDraft: ResponseDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): boolean {

    if (!directionsQuestionnaireDraft.hearingLocation) {
      return false
    } else if (directionsQuestionnaireDraft.expertRequired.option !== undefined) {
      if (directionsQuestionnaireDraft.expertRequired.option.option === YesNoOption.YES.option) {
        if (directionsQuestionnaireDraft.expertReports.declared === undefined) {
          return false
        } else if (directionsQuestionnaireDraft.expertReports.declared.option === YesNoOption.YES.option && !directionsQuestionnaireDraft.expertReports.rows.length) {
          return false
        } else if (!directionsQuestionnaireDraft.permissionForExpert.isCompleted()) {
          return false
        } else if (directionsQuestionnaireDraft.permissionForExpert.option.option === YesNoOption.YES.option) {
          if (!directionsQuestionnaireDraft.expertEvidence.isCompleted()) {
            return false
          } else if (directionsQuestionnaireDraft.expertEvidence.expertEvidence.option === YesNoOption.YES.option && !directionsQuestionnaireDraft.whyExpertIsNeeded.isCompleted()) {
            return false
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
