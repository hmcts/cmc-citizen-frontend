import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimObj } from 'test/http-mocks/claim-store'
import {
  defenceWithAmountClaimedAlreadyPaidData,
  defenceWithDisputeData,
  partialAdmissionAlreadyPaidData,
  fullAdmissionWithImmediatePaymentData,
  partialAdmissionWithImmediatePaymentData
} from 'test/data/entity/responseData'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'

describe('statesPaidHelper', () => {
  describe('isResponseAlreadyPaid', () => {

    it('Should return true if response is full defense and defense type is already paid', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: defenceWithAmountClaimedAlreadyPaidData
        })

      expect(StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(true)
    })

    it('Should return false if response is full defense and defense type is dispute', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: defenceWithDisputeData
        }
      )

      expect(StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(false)
    })

    it('Should return true if response is part admission and there is no payment intention', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: partialAdmissionAlreadyPaidData
        }
      )

      expect(StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(true)
    })

    it('Should return false if response is part admission and there is a payment intention', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: partialAdmissionWithImmediatePaymentData
        }
      )

      expect(StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(false)

    })
  })

  describe('isAlreadyPaidLessThanAmount', () => {
    it('Should return false for full defense', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: defenceWithAmountClaimedAlreadyPaidData
        }
      )

      expect(StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(false)
    })

    it('Should return true for part admission with response amount less than claim totalAmountTillDateOfIssue', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: {
            ...partialAdmissionAlreadyPaidData,
            amount: sampleClaimObj.totalAmountTillDateOfIssue - 1
          }
        }
      )

      expect(StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(true)
    })

    it('Should return false for part admission with response amount equal to claim totalAmountTillDateOfIssue', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: {
            ...partialAdmissionAlreadyPaidData,
            amount: sampleClaimObj.totalAmountTillDateOfIssue
          }
        })

      expect(StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(false)
    })

    it('Should throw an error for a full admission response', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: fullAdmissionWithImmediatePaymentData
        }
      )

      expect(() => StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.throw(Error, StatesPaidHelper.RESPONSE_TYPE_NOT_SUPPORTED)
    })
  })

  describe('getAlreadyPaidAmount', () => {
    it('Should return the claim totalAmountTillDateOfIssue for a full defense response', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: defenceWithAmountClaimedAlreadyPaidData
        }
      )

      expect(StatesPaidHelper.getAlreadyPaidAmount(claim)).to.be.equal(claim.totalAmountTillDateOfIssue)
    })

    it('Should return the response amount for a part admission response', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: partialAdmissionAlreadyPaidData
        }
      )

      expect(StatesPaidHelper.getAlreadyPaidAmount(claim)).to.be.equal(partialAdmissionAlreadyPaidData.amount)
    })

    it('Should throw an error for a full admission response', () => {
      const claim: Claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          response: fullAdmissionWithImmediatePaymentData
        }
      )

      expect(() => StatesPaidHelper.getAlreadyPaidAmount(claim)).to.throw(Error, StatesPaidHelper.RESPONSE_TYPE_NOT_SUPPORTED)
    })
  })
})
