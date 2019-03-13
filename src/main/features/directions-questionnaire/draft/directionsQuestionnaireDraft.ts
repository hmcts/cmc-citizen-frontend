import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  selfWitness?: SelfWitness
  otherWitnesses?: OtherWitnesses
  hearingLocation?: string

  constructor (selfWitness: SelfWitness = new SelfWitness(),
               otherWitnesses: OtherWitnesses = new OtherWitnesses(),
               hearingLocation: string = '') {
    super()
  }

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
      this.selfWitness = input.selfWitness
      this.otherWitnesses = input.otherWitnesses
      this.hearingLocation = input.hearingLocation
    }
    return this
  }
}
