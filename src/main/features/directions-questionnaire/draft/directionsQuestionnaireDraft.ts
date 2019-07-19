import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { Availability } from 'directions-questionnaire/forms/models/availability'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'
import { ExpertReports } from 'directions-questionnaire/forms/models/expertReports'
import { PermissionForExpert } from 'directions-questionnaire/forms/models/permissionForExpert'
import { HearingLocation } from 'directions-questionnaire/forms/models/hearingLocation'

export class DirectionsQuestionnaireDraft extends DraftDocument {

  selfWitness: SelfWitness = new SelfWitness()
  otherWitnesses: OtherWitnesses = new OtherWitnesses()
  hearingLocation: HearingLocation = new HearingLocation()
  hearingLocationSlug: string = ''
  exceptionalCircumstances: ExceptionalCircumstances = new ExceptionalCircumstances()
  availability: Availability = new Availability()
  supportRequired: SupportRequired = new SupportRequired()
  expertRequired: ExpertRequired = new ExpertRequired()
  expertReports: ExpertReports = new ExpertReports()
  permissionForExpert: PermissionForExpert = new PermissionForExpert()
  expertEvidence: ExpertEvidence = new ExpertEvidence()
  whyExpertIsNeeded: WhyExpertIsNeeded

  deserialize (input: any): DirectionsQuestionnaireDraft {
    if (input) {
      this.externalId = input.externalId
      this.selfWitness = new SelfWitness().deserialize(input.selfWitness.option)
      this.otherWitnesses = new OtherWitnesses().deserialize(input.otherWitnesses)
      this.supportRequired = new SupportRequired().deserialize(input.supportRequired)
      this.hearingLocation = new HearingLocation().deserialize(input.hearingLocation)
      this.hearingLocationSlug = input.hearingLocationSlug
      this.exceptionalCircumstances = new ExceptionalCircumstances().deserialize(input.exceptionalCircumstances)
      this.availability = new Availability().deserialize(input.availability)
      this.expertRequired = new ExpertRequired().deserialize(input.expertRequired.option)
      this.expertReports = new ExpertReports().deserialize(input.expertReports)
      this.permissionForExpert = new PermissionForExpert().deserialize(input.permissionForExpert)
      this.expertEvidence = new ExpertEvidence().deserialize(input.expertEvidence)
      this.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize(input.whyExpertIsNeeded)
    }
    return this
  }
}
