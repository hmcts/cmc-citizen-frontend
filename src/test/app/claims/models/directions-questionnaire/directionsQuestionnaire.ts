import { expect } from 'chai'

import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'
import { directionsQuestionnaireDraftSampleData } from '../../../../features/directions-questionnaire/draft/directionsQuestionnaireDraft'

describe('DirectionsQuestionnaire', () => {

  describe('deserialize', () => {
    it('should deserialize directions questionnaire', () => {

      expect(DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)).to.deep.equal(
        { requireSupport:
        {
          languageInterpreter: 'Klingon',
          signLanguageInterpreter: 'Makaton',
          hearingLoop: { option: 'yes' },
          disabledAccess: { option: 'yes' },
          otherSupport: 'Life advice'
        },
          hearingLocation:
          {
            courtName: 'Little Whinging, Surrey',
            hearingLocationSlug: undefined,
            courtAddress: undefined,
            locationOption: undefined,
            exceptionalCircumstancesReason: 'Poorly pet owl'
          },
          witness:
          {
            selfWitness: { option: 'yes' },
            noOfOtherWitness: 1
          },
          expertReportRows: { expertReports: [
            { expertName: 'Prof. McGonagall',expertReportDate: { year: 2018,month: 1,day: 10 } },
            { expertName: 'Mr Rubeus Hagrid',expertReportDate: { year: 2019,month: 2,day: 29 } }
          ]
          },
          unavailableDates: { unavailableDate: [
              { year: 2020,month: 1,day: 4 }, { year: 2020,month: 2,day: 8 }
          ] },
          expertRequest:
          {
            expertEvidenceToExamine: 'yes',
            reasonForExpertAdvice: 'Photographs'
          }
        })
    })
  })
})
