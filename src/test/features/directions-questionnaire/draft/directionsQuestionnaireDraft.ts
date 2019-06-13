/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

export const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft = new DirectionsQuestionnaireDraft().deserialize({
  selfWitness: {
    option: {
      option: 'yes'
    }
  },
  otherWitnesses: {
    otherWitnesses: {
      option: 'yes'
    },
    howMany: 1
  },
  hearingLocation: 'Little Whinging, Surrey',
  exceptionalCircumstances: {
    exceptionalCircumstances: { option : 'yes' },
    reason: 'Poorly pet owl'
  },
  availability: {
    hasUnavailableDates: true,
    unavailableDates: [
      { year: 2020, month: 1, day: 4 },
      { year: 2020, month: 2, day: 8 }
    ]
  },
  supportRequired: {
    languageSelected: true,
    languageInterpreted: 'Klingon',
    signLanguageSelected: true,
    signLanguageInterpreted: 'Makaton',
    hearingLoopSelected: true,
    disabledAccessSelected: true,
    otherSupportSelected: true,
    otherSupport: 'Life advice'
  },
  expertRequired: {
    option: {
      option: 'yes'
    }
  },
  expertReports: {
    declared: true,
    rows: [
      {
        expertName: 'Prof. McGonagall',
        reportDate: { year: 2018, month: 1, day: 10 }
      },
      {
        expertName: 'Mr Rubeus Hagrid',
        reportDate: { year: 2019, month: 2, day: 29 }
      }
    ]
  },
  permissionForExpert: {
    option: {
      option: 'yes'
    }
  },
  expertEvidence: {
    expertEvidence: {
      option: {
        option: 'yes'
      }
    },
    whatToExamine: 'Photographs'
  },
  whyExpertIsNeeded: {
    explanation: 'for expert opinion'
  }
})

describe('DirectionsQuestionnaireDraft', () => {
  describe('deserialization', () => {

    it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for undefined', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(undefined)).to.eql(new DirectionsQuestionnaireDraft())
    })

    it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for null', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(null)).to.eql(new DirectionsQuestionnaireDraft())
    })

    it('should return a DirectionsQuestionnaireDraft instance initialised with valid data', () => {

      expect(directionsQuestionnaireDraftSampleData.selfWitness.option.option).to.equal('yes')
      expect(directionsQuestionnaireDraftSampleData.otherWitnesses.otherWitnesses.option).to.equal('yes')
      expect(directionsQuestionnaireDraftSampleData.otherWitnesses.howMany).to.equal(1)
      expect(directionsQuestionnaireDraftSampleData.hearingLocation).to.equal('Little Whinging, Surrey')
      expect(directionsQuestionnaireDraftSampleData.exceptionalCircumstances.exceptionalCircumstances.option).to.equal('yes')
      expect(directionsQuestionnaireDraftSampleData.exceptionalCircumstances.reason).to.equal('Poorly pet owl')
      expect(directionsQuestionnaireDraftSampleData.availability.hasUnavailableDates).to.be.true
      expect(directionsQuestionnaireDraftSampleData.availability.unavailableDates).to.have.deep.members([
        { year: 2020, month: 1, day: 4 },
        { year: 2020, month: 2, day: 8 }
      ])
      expect(directionsQuestionnaireDraftSampleData.supportRequired.languageSelected).to.be.true
      expect(directionsQuestionnaireDraftSampleData.supportRequired.languageInterpreted).to.equal('Klingon')
      expect(directionsQuestionnaireDraftSampleData.supportRequired.signLanguageSelected).to.be.true
      expect(directionsQuestionnaireDraftSampleData.supportRequired.signLanguageInterpreted).to.equal('Makaton')
      expect(directionsQuestionnaireDraftSampleData.supportRequired.hearingLoopSelected).to.be.true
      expect(directionsQuestionnaireDraftSampleData.supportRequired.disabledAccessSelected).to.be.true
      expect(directionsQuestionnaireDraftSampleData.supportRequired.otherSupportSelected).to.be.true
      expect(directionsQuestionnaireDraftSampleData.supportRequired.otherSupport).to.equal('Life advice')
      expect(directionsQuestionnaireDraftSampleData.expertRequired.option.option).to.equal('yes')
      expect(directionsQuestionnaireDraftSampleData.expertReports.declared).to.be.true
      expect(directionsQuestionnaireDraftSampleData.expertReports.rows).to.have.length(2)
      expect(directionsQuestionnaireDraftSampleData.expertReports.rows[0].expertName).to.equal('Prof. McGonagall')
      expect(directionsQuestionnaireDraftSampleData.expertReports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 1, day: 10 })
      expect(directionsQuestionnaireDraftSampleData.expertReports.rows[1].expertName).to.equal('Mr Rubeus Hagrid')
      expect(directionsQuestionnaireDraftSampleData.expertReports.rows[1].reportDate).to.deep.equal({ year: 2019, month: 2, day: 29 })
    })
  })
})
