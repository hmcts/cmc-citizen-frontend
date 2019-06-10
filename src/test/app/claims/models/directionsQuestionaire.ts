import { expect } from 'chai'
import { DirectionsQuestionnaire } from 'claims/models/directionsQuestionnaire'
import { ReportRow } from 'directions-questionnaire/forms/models/reportRow'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { ExpertReports } from 'directions-questionnaire/forms/models/expertReports'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'
import { Availability } from 'directions-questionnaire/forms/models/availability'

const directionsQuestionnaireResponseData = {
  selfWitness: 'yes',
  howManyOtherWitness: 2,
  hearingLocation: 'Birmingham District Probate Registry',
  expertEvidenceToExamine: 'Photographs',
  reasonForExpertAdvice: 'To give opinion',
  expertReportsRows: [new ReportRow()],
  exceptionalCircumstancesReason: 'Documents',
  disabledAccess: 'yes',
  languageInterpreted: 'language document',
  signLanguageInterpreted: 'sign language document',
  hearingLoop: 'yes',
  otherSupportRequired: 'other documents',
  availableDate: undefined,
  hearingLocationSlug: undefined,
  unavailableDates: undefined
}

describe('Response', () => {

  describe('deserialize', () => {

    it('should convert response object when everything is fine', () => {
      const actual: DirectionsQuestionnaire = new DirectionsQuestionnaire().fromObject({
        selfWitness: new SelfWitness().deserialize({ option: 'yes' }),
        otherWitnesses: new OtherWitnesses().deserialize({ otherWitnesses: { option: 'yes' }, howMany: 2 }),
        hearingLocation: 'Birmingham District Probate Registry',
        expertRequired: new ExpertRequired().deserialize({ option: 'yes' }),
        exceptionalCircumstances: new ExceptionalCircumstances().deserialize({
          exceptionalCircumstances: {
            option: 'yes'
          },
          reason: 'Documents'
        }),
        availability: new Availability().deserialize({ hasUnavailableDates: false, unavailableDates: [] }),
        supportRequired: new SupportRequired().deserialize({
          languageSelected: true,
          languageInterpreted: 'language document',
          disabledAccessSelected: true,
          signLanguageSelected: true,
          signLanguageInterpreted: 'sign language document',
          hearingLoopSelected: true,
          otherSupportSelected: true,
          otherSupport: 'other documents'
        }),
        expertReports: new ExpertReports().deserialize({ declared: true, rows: [] }),
        expertEvidence: new ExpertEvidence().deserialize({
          expertEvidence: { option: 'yes' },
          whatToExamine: 'Photographs'
        }),
        whyExpertIsNeeded: new WhyExpertIsNeeded().deserialize({ explanation: 'To give opinion' })
      })
      expect(actual).to.deep.equal(directionsQuestionnaireResponseData)
    })
  })
})
