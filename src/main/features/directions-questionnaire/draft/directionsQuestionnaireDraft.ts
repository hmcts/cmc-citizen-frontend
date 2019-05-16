import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { Availability } from 'directions-questionnaire/forms/models/availability'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  selfWitness?: SelfWitness
  otherWitnesses?: OtherWitnesses
  hearingLocation?: string
  exceptionalCircumstances?: ExceptionalCircumstances
  availability?: Availability
  supportRequired?: SupportRequired
  expertEvidence?: ExpertEvidence
  expertRequired?: ExpertRequired
  whyExpertIsNeeded?: WhyExpertIsNeeded

  constructor (selfWitness: SelfWitness = new SelfWitness(),
               otherWitnesses: OtherWitnesses = new OtherWitnesses(),
               hearingLocation: string = '',
               exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances(),
               availability: Availability = new Availability(),
               supportRequired: SupportRequired = new SupportRequired(),
               expertRequired: ExpertRequired = new ExpertRequired(),
               whyExpertIsNeeded: WhyExpertIsNeeded = new WhyExpertIsNeeded()
  ) {
    super()
  }

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
      this.selfWitness = input.selfWitness
      this.otherWitnesses = input.otherWitnesses
      this.supportRequired = input.supportRequired
      this.hearingLocation = input.hearingLocation
      this.exceptionalCircumstances = input.exceptionalCircumstances
      this.availability = Availability.fromObject(input.availability)
      this.expertRequired = input.expertRequired
      this.whyExpertIsNeeded = input.whyExpertIsNeeded
    }
    return this
  }
}
