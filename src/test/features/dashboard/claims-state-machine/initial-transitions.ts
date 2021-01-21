import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj, sampleHwfClaimIssueObj, sampleHwfClaimIssueRejectObj } from 'test/http-mocks/claim-store'

import { initialTransitions } from 'dashboard/claims-state-machine/initial-transitions'
import { MomentFactory } from 'shared/momentFactory'
import { ResponseType } from 'claims/models/response/responseType'

describe('State Machine for the dashboard status before response', () => {
  describe('given the claim with no response', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize(sampleClaimIssueObj)
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('no-response')
    })
  })

  describe('given the HWF claim which is under review', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueObj, lastEventTriggeredForHwfCase : 'CreateHelpWithFeesClaim' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fees')
    })
  })

  describe('given the HWF claim which is under review', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueObj, lastEventTriggeredForHwfCase : 'MiscHWF' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fees')
    })
  })

  describe('given the HWF claim which is under review', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueObj, lastEventTriggeredForHwfCase : 'RecalculateInterest' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fess-intrest-recalculated')
    })
  })

  describe('HWF reference is invalid', () => {
    it('should extract the correct state for the invalid HWF reference', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueObj, state: 'AWAITING_RESPONSE_HWF', lastEventTriggeredForHwfCase : 'InvalidHWFReference' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fees-invalid')
    })
  })

  describe('HWF no-remission entitled / Full remission rejected', () => {
    it('should extract the correct state for the HWF no-remission entitled / Full remission rejected', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueRejectObj, state: 'AWAITING_RESPONSE_HWF', lastEventTriggeredForHwfCase : 'NoRemissionHWF' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fees-rejected')
    })
  })

  describe('HWF no-remission entitled / Full remission rejected', () => {
    it('should extract the correct state for the HWF no-remission entitled / Full remission rejected', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleHwfClaimIssueRejectObj, state: 'AWAITING_RESPONSE_HWF', lastEventTriggeredForHwfCase : 'MoreInfoRequiredForHWF' })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('help-with-fess-more-info-required')
    })
  })

  describe('given the claim with more time requested', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({ ...sampleClaimIssueObj, moreTimeRequested: true })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('more-time-requested')
    })
  })

  describe('given the claim with response deadline passed', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        responseDeadline: MomentFactory.currentDate().add(-1, 'days')
      })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('no-response-past-deadline')
    })
  })

  describe('given the claim with full defence response', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: { responseType: ResponseType.FULL_DEFENCE }
      })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('full-defence')
    })
  })

  describe('given the claim with full admission response', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: { responseType: ResponseType.FULL_ADMISSION }
      })
      let claimState = initialTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('init')
    })
  })
})
