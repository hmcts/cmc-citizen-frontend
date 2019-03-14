import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

export class DetailsInCaseOfHearingTask {
  static isCompleted (draft: DraftClaimantResponse, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): boolean {
    return directionsQuestionnaireDraft && directionsQuestionnaireDraft.otherWitnesses && directionsQuestionnaireDraft.otherWitnesses.isCompleted() &&
       directionsQuestionnaireDraft.selfWitness && directionsQuestionnaireDraft.selfWitness.isCompleted()
  }
}
