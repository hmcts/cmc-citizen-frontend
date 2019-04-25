import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj } from 'test/http-mocks/claim-store'

import { fullDefenceTransitions } from 'dashboard/claims-state-machine/full-defence-transitions'
import { ResponseType } from 'claims/models/response/responseType'
import { DefenceType } from 'claims/models/response/defenceType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { MomentFactory } from 'shared/momentFactory'

describe('State Machine for the dashboard status before response', () => {

  describe('given the claim with full defence already paid defendant response', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.ALREADY_PAID
        }
      })
      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-already-paid')
    })
  })

  describe('given the claim with full defence already paid Claimant rejected to defendant response', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.ALREADY_PAID,
          paymentDeclaration: {
            paidDate: '01-01-2019',
            paidAmount: 100,
            explanation: 'test'
          }
        },
        claimantResponse: {
          type: ClaimantResponseType.REJECTION
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-already-paid-reject')
    })
  })

  describe('given the claim with full defence reject with mediation', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.YES
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-reject-with-mediation')
    })
  })

  describe('given the claim with full defence reject without mediation', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.NO
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-reject-without-mediation')
    })
  })

  describe('given the claim with full defence offers settlement with mediation', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.YES
        },
        settlement: {
          partyStatements: [
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-settlement-offer-with-mediation')
    })
  })

  describe('given the claim with full defence offers settlement without mediation', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.NO
        },
        settlement: {
          partyStatements: [
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-settlement-offer-without-mediation')
    })
  })

  describe('given the claim with full defence reject offers settlement without mediation ', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.NO
        },
        settlement: {
          partyStatements: [
            {
              madeBy: 'CLAIMANT',
              type: 'REJECTION'
            },
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-settlement-offer-reject-without-mediation')
    })
  })

  describe('given the claim with full defence reject offers settlement with mediation ', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.YES
        },
        settlement: {
          partyStatements: [
            {
              madeBy: 'CLAIMANT',
              type: 'REJECTION'
            },
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-settlement-offer-reject-with-mediation')
    })
  })

  describe('given the claim with full defence made agreement with mediation ', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.YES
        },
        settlement: {
          partyStatements: [
            {
              madeBy: 'CLAIMANT',
              type: 'ACCEPTATION'
            },
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-made-agreement-with-mediation')
    })
  })

  describe('given the claim with full defence made agreement without mediation ', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.NO
        },
        settlement: {
          partyStatements: [
            {
              madeBy: 'CLAIMANT',
              type: 'ACCEPTATION'
            },
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        }
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-made-agreement-without-mediation')
    })
  })

  describe('given the claim with full defence settled with agreement ', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.FULL_DEFENCE,
          freeMediation: FreeMediationOption.NO
        },
        settlement: {
          partyStatements: [
            {
              madeBy: 'DEFENDANT',
              type: 'COUNTERSIGNATURE'
            },
            {
              madeBy: 'CLAIMANT',
              type: 'ACCEPTATION'
            },
            {
              type: 'OFFER',
              madeBy: 'DEFENDANT',
              offer: {
                content: 'test',
                completionDate: MomentFactory.parse('2019-05-01')
              }
            }
          ]
        },
        settlementReachedAt: MomentFactory.parse('2019-03-01')
      })

      let claimState = fullDefenceTransitions(claim)
      claimState.findState(claimState)
      expect(claimState.state).to.equal('fd-settled-with-agreement')
    })
  })

})
