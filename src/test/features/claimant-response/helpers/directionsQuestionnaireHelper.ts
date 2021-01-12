import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimObj } from 'test/http-mocks/claim-store'
import {
  defenceWithAmountClaimedAlreadyPaidData,
  defenceWithDisputeData,
  partialAdmissionAlreadyPaidData,
  partialAdmissionAlreadyPaidLessData,
  fullAdmissionWithImmediatePaymentData,
  partialAdmissionWithImmediatePaymentData
} from 'test/data/entity/responseData'
import { DirectionsQuestionnaireHelper } from 'claimant-response/helpers/directionsQuestionnaireHelper'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { FeatureToggles } from 'utils/featureToggles'

describe('directionsQuestionnaireHelper', () => {

  it('Should return true if response is full defense and defense type is already paid and claimant want to proceed with the claim', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: defenceWithAmountClaimedAlreadyPaidData,
        features: ['directionsQuestionnaire']
      })
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      accepted: {
        accepted: {
          option: YesNoOption.NO
        }
      }
    })
    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return true if response is full defense and defense type is dispute and claimant wants to proceed with the claim', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: defenceWithDisputeData,
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      intentionToProceed: {
        proceed: {
          option: YesNoOption.YES
        }
      }
    })

    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return true if response is part admission and there is no payment intention and claimant rejects the defence', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: partialAdmissionAlreadyPaidData,
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      accepted: {
        accepted: {
          option: YesNoOption.NO
        }
      }
    })
    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return true if response is part admission with paid less and there is no payment intention and claimant rejects the defence', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: partialAdmissionAlreadyPaidLessData,
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      accepted: {
        accepted: {
          option: YesNoOption.NO
        }
      }
    })
    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return true if response is part admission and part recieved and there is no payment intention and claimant rejects the defence', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: partialAdmissionAlreadyPaidLessData,
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      accepted: {
        accepted: {
          option: YesNoOption.NO
        }
      },
      partPaymentReceived: {
        received: {
          option: YesNoOption.NO
        }
      }
    })
    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return true if response is part recieved with paid less and there is no payment intention and claimant rejects the defence', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: partialAdmissionAlreadyPaidLessData,
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      partPaymentReceived: {
        received: {
          option: YesNoOption.NO
        }
      }
    })
    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true)
    }
  })

  it('Should return false if response is part admission and there is a payment intention and claimant reject admission', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: partialAdmissionWithImmediatePaymentData(),
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({
      accepted: {
        accepted: {
          option: YesNoOption.NO
        }
      }
    })
    expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(false)

  })

  it('Should return false for full admission response', () => {
    const claim: Claim = new Claim().deserialize(
      {
        ...sampleClaimObj,
        response: fullAdmissionWithImmediatePaymentData(),
        features: ['directionsQuestionnaire']
      }
    )
    const claimantResponseDraft: DraftClaimantResponse = new DraftClaimantResponse().deserialize({})
    expect(DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(false)
  })

})
