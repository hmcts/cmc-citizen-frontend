import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { Availability } from 'directions-questionnaire/forms/models/availability'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  selfWitness?: SelfWitness
  otherWitnesses?: OtherWitnesses
  hearingLocation?: string
  exceptionalCircumstances?: ExceptionalCircumstances
  availability?: Availability

  constructor (selfWitness: SelfWitness = new SelfWitness(),
               otherWitnesses: OtherWitnesses = new OtherWitnesses(),
               hearingLocation: string = '',
               exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(),
               availability: Availability = new Availability()) {
    super()
  }

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
      this.selfWitness = input.selfWitness
      this.otherWitnesses = input.otherWitnesses
      this.hearingLocation = input.hearingLocation
      this.exceptionalCircumstances = input.exceptionalCircumstances
      this.availability = Availability.fromObject(input.availability)
    }
    return this
  }
}
