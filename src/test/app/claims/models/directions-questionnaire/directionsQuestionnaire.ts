import { expect } from 'chai'

import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'
import { sampleDirectionsQuestionnaireDraftObj } from '../../../../http-mocks/draft-store'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { CourtLocationType } from 'claims/models/directions-questionnaire/hearingLocation'

describe('DirectionsQuestionnaire', () => {

  const expectedData = {
    requireSupport:
    {
      languageInterpreter: 'Klingon',
      signLanguageInterpreter: 'Makaton',
      hearingLoop: 'yes',
      disabledAccess: 'yes',
      otherSupport: 'Life advice'
    },
    hearingLocation:
    {
      courtName: 'Little Whinging, Surrey',
      hearingLocationSlug: undefined,
      courtAddress: undefined,
      locationOption: CourtLocationType.SUGGESTED_COURT,
      exceptionalCircumstancesReason: 'Poorly pet owl'
    },
    witness:
    {
      selfWitness: 'yes',
      noOfOtherWitness: 1
    },
    expertReports: [
      {
        expertName: 'Prof. McGonagall',
        expertReportDate: '2018-01-10'
      },
      {
        expertName: 'Mr Rubeus Hagrid',
        expertReportDate: '2019-02-27'
      }],
    unavailableDates: [
      { unavailableDate: '2020-01-04' },
      { unavailableDate: '2020-02-08' }],
    expertRequest:
    {
      expertEvidenceToExamine: 'Photographs',
      reasonForExpertAdvice: 'for expert opinion'
    }
  }

  describe('deserialize', () => {
    it('should deserialize directions questionnaire', () => {
      const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft =
        new DirectionsQuestionnaireDraft().deserialize(sampleDirectionsQuestionnaireDraftObj)

      expect(DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)).to.deep.equal(expectedData)
    })

    it('should deserialize undefined directions questionnaire and it should return undefined', () => {
      expect(DirectionsQuestionnaire.deserialize(undefined)).to.be.equal(undefined)
    })

    it('from object should return response object when we pass the dqs from backend', () => {
      const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft =
        new DirectionsQuestionnaireDraft().deserialize(sampleDirectionsQuestionnaireDraftObj)
      const directionsQuestionnaireResponseData = DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)

      expect(DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal(directionsQuestionnaireResponseData)
    })
  })
})
