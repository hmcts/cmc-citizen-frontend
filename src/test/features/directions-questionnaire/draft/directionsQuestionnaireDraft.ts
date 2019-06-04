/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

describe('DirectionsQuestionnaireDraft', () => {
  describe('deserialization', () => {

    it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for undefined', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(undefined)).to.eql(new DirectionsQuestionnaireDraft())
    })

    it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for null', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(null)).to.eql(new DirectionsQuestionnaireDraft())
    })

    it('should return a DirectionsQuestionnaireDraft instance initialised with valid data', () => {
      const draft: DirectionsQuestionnaireDraft = new DirectionsQuestionnaireDraft().deserialize({
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
          exceptionalCircumstances: 'yes',
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
        }
      })

      expect(draft.selfWitness.option.option).to.equal('yes')
      expect(draft.otherWitnesses.otherWitnesses.option).to.equal('yes')
      expect(draft.otherWitnesses.howMany).to.equal(1)
      expect(draft.hearingLocation).to.equal('Little Whinging, Surrey')
      expect(draft.exceptionalCircumstances.exceptionalCircumstances.option).to.equal('yes')
      expect(draft.exceptionalCircumstances.reason).to.equal('Poorly pet owl')
      expect(draft.availability.hasUnavailableDates).to.be.true
      expect(draft.availability.unavailableDates).to.have.deep.members([
        { year: 2020, month: 1, day: 4 },
        { year: 2020, month: 2, day: 8 }
      ])
      expect(draft.supportRequired.languageSelected).to.be.true
      expect(draft.supportRequired.languageInterpreted).to.equal('Klingon')
      expect(draft.supportRequired.signLanguageSelected).to.be.true
      expect(draft.supportRequired.signLanguageInterpreted).to.equal('Makaton')
      expect(draft.supportRequired.hearingLoopSelected).to.be.true
      expect(draft.supportRequired.disabledAccessSelected).to.be.true
      expect(draft.supportRequired.otherSupportSelected).to.be.true
      expect(draft.supportRequired.otherSupport).to.equal('Life advice')
      expect(draft.expertRequired.option.option).to.equal('yes')
      expect(draft.expertReports.declared).to.be.true
      expect(draft.expertReports.rows).to.have.length(2)
      expect(draft.expertReports.rows[0].expertName).to.equal('Prof. McGonagall')
      expect(draft.expertReports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 1, day: 10 })
      expect(draft.expertReports.rows[1].expertName).to.equal('Mr Rubeus Hagrid')
      expect(draft.expertReports.rows[1].reportDate).to.deep.equal({ year: 2019, month: 2, day: 29 })
    })
  })
})
