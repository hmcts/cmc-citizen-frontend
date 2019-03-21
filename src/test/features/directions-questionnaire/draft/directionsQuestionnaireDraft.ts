import { expect } from 'chai'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

describe('DirectionsQuestionnaireDraft', () => {
  describe('deserialization', () => {

    it('should return a DraftMediation instance initialised with defaults for undefined', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(undefined)).to.eql(new DirectionsQuestionnaireDraft())
    })

    it('should return a DraftMediation instance initialised with defaults for null', () => {
      expect(new DirectionsQuestionnaireDraft().deserialize(null)).to.eql(new DirectionsQuestionnaireDraft())
    })

  })
})
