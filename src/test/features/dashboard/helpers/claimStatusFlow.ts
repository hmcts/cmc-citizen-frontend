import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimObj } from 'test/http-mocks/claim-store'
import { ClaimStatusNode, ClaimStatusFlow } from 'dashboard/helpers/claimStatusFlow'

describe('The dashboard status rule engine', () => {
  describe('given the claim flow', () => {
    it('should extract the correct dashboard for claim issued', () => {
      const claim: Claim = new Claim().deserialize(sampleClaimObj)
      expect(ClaimStatusFlow.dashboardFor(claim)).to.equal('claim_issued')
    })
  })

  describe('given a generic flow', () => {
    it('should return the dashboard of the only valid state', () => {
      const flow: ClaimStatusNode = {
        description: 'this is always true',
        isValidFor: () => true,
        dashboard: 'first',
        next: []
      }
      const claim: Claim = new Claim().deserialize(sampleClaimObj)
      expect(ClaimStatusFlow.decide(flow, claim)).to.equal(`first`)
    })
  })
  it('should return the dashboard of the last valid state', () => {
    const flow: ClaimStatusNode = {
      description: 'this is always true',
      isValidFor: () => true,
      dashboard: 'first',
      next: [{
        description: '',
        isValidFor: () => false,
        dashboard: 'second',
        next: []
      }, {
        description: '',
        isValidFor: () => true,
        dashboard: 'third',
        next: [{
          description: 'this is the one',
          isValidFor: () => true,
          dashboard: 'fourth',
          next: []
        }]
      }, {
        description: '',
        isValidFor: () => false,
        dashboard: 'fifth',
        next: []
      }]
    }
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    expect(ClaimStatusFlow.decide(flow, claim)).to.equal(`fourth`)
  })
  it('should return the dashboard of the last valid state even if there are other states after', () => {
    const flow: ClaimStatusNode = {
      description: 'this is always true',
      isValidFor: () => true,
      dashboard: 'first',
      next: [{
        description: '',
        isValidFor: () => false,
        dashboard: 'second',
        next: []
      }, {
        description: '',
        isValidFor: () => true,
        dashboard: 'third',
        next: [{
          description: 'this',
          isValidFor: () => true,
          dashboard: 'fourth',
          next: [{
            description: '',
            isValidFor: () => false,
            dashboard: 'fifth',
            next: [{
              description: 'this should not happen',
              isValidFor: () => true,
              dashboard: 'sixth',
              next: []
            }]
          }]
        }]
      }, {
        description: '',
        isValidFor: () => false,
        dashboard: 'seventh',
        next: []
      }]
    }
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    expect(ClaimStatusFlow.decide(flow, claim)).to.equal(`fourth`)
  })
  it('should throw an error if two paths are possible', () => {
    const flow: ClaimStatusNode = {
      description: 'this is always true',
      isValidFor: () => true,
      dashboard: 'first',
      next: [{
        description: 'this is still true',
        isValidFor: () => true,
        dashboard: 'second',
        next: []
      }, {
        description: 'this is true but it shouldnt be',
        isValidFor: () => true,
        dashboard: 'third',
        next: []
      }]
    }
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    expect(() => ClaimStatusFlow.decide(flow, claim)).to.throw(`Two possible paths are valid for a claim, check the flow's logic`)
  })
  it('should throw an error if trying to render an intermediate state', () => {
    const flow: ClaimStatusNode = {
      description: 'this is true but has no dashboard, so it should not be picked',
      isValidFor: () => true,
      next: [{
        description: 'nope',
        isValidFor: () => false,
        dashboard: 'second',
        next: []
      }, {
        description: 'nope',
        isValidFor: () => false,
        dashboard: 'third',
        next: []
      }]
    }
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    expect(() => ClaimStatusFlow.decide(flow, claim)).to.throw(`Trying to render an intermediate state with no dashboard, check the flow's logic`)
  })
})
