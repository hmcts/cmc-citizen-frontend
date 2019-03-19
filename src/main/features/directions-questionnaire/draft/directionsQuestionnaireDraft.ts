import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  selfWitness?: SelfWitness
  otherWitnesses?: OtherWitnesses
  supportRequired?: SupportRequired

  constructor (selfWitness: SelfWitness = new SelfWitness(),
               otherWitnesses: OtherWitnesses = new OtherWitnesses(),
               supportRequired: SupportRequired = new SupportRequired()) {
    super()
  }

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
      this.selfWitness = input.selfWitness
      this.otherWitnesses = input.otherWitnesses
      this.supportRequired = input.supportRequired
    }
    return this
  }
}
