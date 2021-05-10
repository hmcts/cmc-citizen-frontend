import { expect } from 'chai'

import { MediationDraft } from 'main/features/mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { NoMediationReasonOptions } from 'mediation/form/models/NoMediationReasonOptions'

describe('MediationDraft', () => {
  describe('deserialization', () => {

    it('should return a DraftMediation instance initialised with defaults for undefined', () => {
      expect(new MediationDraft().deserialize(undefined)).to.eql(new MediationDraft())
    })

    it('should return a DraftMediation instance initialised with defaults for null', () => {
      expect(new MediationDraft().deserialize(null)).to.eql(new MediationDraft())
    })

    it('should return a DraftMediation instance initialised with valid data', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        willYouTryMediation: {
          option: FreeMediationOption.YES
        }
      })
      expect(draft.externalId).to.eql(myExternalId)
      expect(draft.willYouTryMediation.option).to.eql(FreeMediationOption.YES)
    })

    it('should return a DraftMediation instance initialised with valid data when mediation is said NO', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        willYouTryMediation: {
          option: FreeMediationOption.NO
        },
        noMediationReason: {
          iDoNotWantMediationReason: NoMediationReasonOptions.OTHER,
          otherReason: 'Not interested'
        }
      })
      expect(draft.externalId).to.eql(myExternalId)
      expect(draft.willYouTryMediation.option).to.eql(FreeMediationOption.NO)
      expect(draft.noMediationReason.iDoNotWantMediationReason).to.eql(NoMediationReasonOptions.OTHER)
      expect(draft.noMediationReason.otherReason).to.eql('Not interested')
    })
  })
})
