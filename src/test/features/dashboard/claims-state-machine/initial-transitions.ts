import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj } from 'test/http-mocks/claim-store'

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
      expect(claimState.state).to.equal('full-admission')
    })
  })
})
