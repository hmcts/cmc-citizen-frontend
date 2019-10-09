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
    expertRequired: 'yes',
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

    it('should deserialize directions questionnaire correctly when no expert reports and no expert evidence', () => {
      const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft
        = new DirectionsQuestionnaireDraft().deserialize({...sampleDirectionsQuestionnaireDraftObj, ...{
          expertReports: {
            declared: true,
            rows: [{}]
          },
          expertEvidence: undefined
        }})

      expect(DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)).to.deep.equal({...expectedData, ...{
        expertReports: undefined,
        expertRequest: undefined
      }})
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

    it('from object should return undefined when input is undefined', () => {
      expect(DirectionsQuestionnaire.fromObject(undefined)).to.be.equal(undefined)
    })

    it('deserialize object should return hearing location undefined when courtName or alternateCourtName is undefined.', () => {

      const sampleObj = {...sampleDirectionsQuestionnaireDraftObj, hearingLocation: {
        courtName: undefined,
        courtPostCode: undefined,
        courtAccepted: undefined,
        alternateCourtName: undefined }
      }

      const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft =
        new DirectionsQuestionnaireDraft().deserialize(sampleObj)
      const directionsQuestionnaireResponseData = DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)

      expect(DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal({...expectedData,...{
        hearingLocation: undefined}})
    })

    it('deserialize object should return hearing location when alternateCourtName is provided.', () => {

      const sampleObj = {...sampleDirectionsQuestionnaireDraftObj, hearingLocation: {
        alternativeCourtName: 'Little Whinging, Surrey',
        hearingLocationSlug: undefined,
        courtAddress: undefined,
        exceptionalCircumstancesReason: 'Poorly pet owl'}}

      const directionsQuestionnaireDraftSampleData: DirectionsQuestionnaireDraft =
        new DirectionsQuestionnaireDraft().deserialize(sampleObj)
      const directionsQuestionnaireResponseData = DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)

      expect(DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal({...expectedData,...{
        hearingLocation: {
          courtAddress: undefined,
          courtName: 'Little Whinging, Surrey',
          exceptionalCircumstancesReason: 'Poorly pet owl',
          hearingLocationSlug: undefined,
          locationOption: 'ALTERNATE_COURT'
        }}})
    })
  })
})
