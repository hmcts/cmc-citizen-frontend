import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj, sampleClaimObj } from 'test/http-mocks/claim-store'
import { ClaimStatusFlow, ClaimStatusNode } from 'dashboard/helpers/claimStatusFlow'
import {
  baseFullAdmissionData,
  basePartialAdmissionData,
  basePayByInstalmentsData,
  basePayBySetDateData,
  basePayImmediatelyData,
  baseResponseData
} from 'test/data/entity/responseData'
import { MomentFactory } from 'shared/momentFactory'
import { MadeBy } from 'offer/form/models/madeBy'
import { StatementType } from 'offer/form/models/statementType'
import { PaymentOption } from 'claims/models/paymentOption'

function createSettlement (defendantAction, date?, type?) {
  return {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT.value,
        offer: {
          content: 'My offer contents here.',
          completionDate: date || MomentFactory.currentDate().add(2, 'days'),
          paymentIntention: {
            repaymentPlan: {
              firstPaymentDate: date || MomentFactory.currentDate().add(2, 'days')
            },
            paymentOption: type || PaymentOption.BY_SPECIFIED_DATE,
            paymentDate: date || MomentFactory.currentDate().add(2, 'days')
          }
        }
      },
      {
        madeBy: MadeBy.CLAIMANT.value,
        type: StatementType.ACCEPTATION.value
      },
      {
        madeBy: MadeBy.DEFENDANT.value,
        type: defendantAction
      }
    ]
  }
}

describe('The dashboard status rule engine', () => {

  describe.only('given the claim flow', () => {

    // this will be removed once more flows are added to the "new" dashboard
    it('should extract an empty dashboard if a claim is not in full admission', () => {
      const partAdmissionClaim = {
        ...sampleClaimObj,
        responseDeadline: MomentFactory.currentDate().add(1, 'days'),
        response: {
          ...baseResponseData,
          ...basePartialAdmissionData
        }
      }
      expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(partAdmissionClaim))).to.eql('')
    })

    it('should extract the claim_issued dashboard for claim issued', () => {
      const issuedClaim = {
        ...sampleClaimIssueObj,
        responseDeadline: MomentFactory.currentDate().add(1, 'days')
      }
      expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(issuedClaim))).to.eql('claim_issued')
    })

    it('should extract the more_time_requested dashboard for claim issued', () => {
      const moreTimeRequestedClaim = {
        ...sampleClaimIssueObj,
        responseDeadline: MomentFactory.currentDate().add(1, 'days'),
        moreTimeRequested: true
      }
      expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(moreTimeRequestedClaim))).to.eql('more_time_requested')
    })

    it('should extract the past_response_deadline dashboard if past response deadline', () => {
      const afterDeadlineClaim = {
        ...sampleClaimObj,
        responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
      }
      expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(afterDeadlineClaim))).to.eql('past_response_deadline')
    })

    it('should extract the ccj_requested dashboard if past response deadline and claimant requests ccj', () => {
      const afterDeadlineClaim = {
        ...sampleClaimObj,
        responseDeadline: MomentFactory.currentDate().subtract(1, 'days'),
        countyCourtJudgmentRequestedAt: MomentFactory.currentDateTime().subtract(1, 'days')
      }
      expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(afterDeadlineClaim))).to.eql('ccj_requested')
    })

    context('when a claim is in full admission', () => {
      const fullAdmissionClaim = {
        ...sampleClaimObj,
        responseDeadline: MomentFactory.currentDate().add(1, 'days'),
        response: {
          ...baseResponseData,
          ...baseFullAdmissionData
        }
      }

      context('when a claim is in pay immediately', () => {
        const payImmediatelyClaim = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
        }

        it('should extract the pay_immediately dashboard if the payment is before deadline', () => {
          expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(payImmediatelyClaim))).to.eql('pay_immediately')
        })

        it('should extract the pay_immediately dashboard if the payment is after deadline', () => {
          const payImmediatelyPastPaymentDeadline = {
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response,
              paymentIntention: {
                paymentOption: PaymentOption.IMMEDIATELY,
                paymentDate: MomentFactory.currentDate().subtract(5, 'days')
              }
            }
          }
          expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(payImmediatelyPastPaymentDeadline))).to.eql('pay_immediately')
        })

        it('should extract the ccj_requested dashboard if the payment is after deadline and ccj has been requested', () => {
          const requestedJudgementAfterPaymentDeadline = {
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response,
              paymentIntention: {
                paymentOption: PaymentOption.IMMEDIATELY,
                paymentDate: MomentFactory.currentDate().subtract(5, 'days')
              }
            },
            countyCourtJudgmentRequestedAt: MomentFactory.currentDateTime().subtract(1, 'days')
          }
          expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(requestedJudgementAfterPaymentDeadline))).to.eql('ccj_requested')
        })
      })

      context('when a claim is in pay by set date', () => {
        it('should extract the pay_by_set_date dashboard for pay by set date claim', () => {
          const payBySetDateClaim = {
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
          }
          expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(payBySetDateClaim))).to.eql('pay_by_set_date')
        })
      })

      context('when a claim is in pay by instalments', () => {
        it('should extract the pay_by_instalments dashboard for pay by instalments claim', () => {
          const payByInstalmentsDateClaim = {
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
          }
          expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(payByInstalmentsDateClaim))).to.eql('pay_by_instalments')
        })
      })

      context('when claimant accepts repayment plan', () => {

        it('should extract the claimant_accepted_repayment_plan', () => {
          const claimantResponse = {
            type: 'ACCEPTATION',
            formaliseOption: 'SETTLEMENT'
          }

          const claim = new Claim().deserialize({
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
            countyCourtJudgment: null,
            settlement: null,
            claimantResponse: claimantResponse
          })
          expect(ClaimStatusFlow.dashboardFor(claim)).to.eql('claimant_accepted_repayment_plan')
        })

        it('should extract the claimants_wants_to_sign_settlement_agreement dashboard if claimants selects settlement agreement', () => {
          const claimantResponse = {
            type: 'ACCEPTATION',
            formaliseOption: 'SETTLEMENT'
          }

          const claim = new Claim().deserialize({
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
            countyCourtJudgment: null,
            settlement: {},
            claimantResponse: claimantResponse
          })
          expect(ClaimStatusFlow.dashboardFor(claim)).to.eql('claimants_wants_to_sign_settlement_agreement')
        })

        it('should extract the ccj_admission_accept_payment_plan if claimants selects CCJ', () => {
          const claimantResponse = {
            type: 'ACCEPTATION',
            formaliseOption: 'CCJ'
          }

          const claim = new Claim().deserialize({
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
            countyCourtJudgment: null,
            settlement: null,
            claimantResponse: claimantResponse
          })
          expect(ClaimStatusFlow.dashboardFor(claim)).to.eql('ccj_admission_accept_payment_plan')
        })

        it('should extract the claimant_signed_agreement dashboard when claimant has signed the agreement', () => {
          const settlement = createSettlement(StatementType.ACCEPTATION.value)
          const claimantResponse = {
            type: 'ACCEPTATION',
            formaliseOption: 'SETTLEMENT'
          }

          const claim = new Claim().deserialize({
            ...fullAdmissionClaim,
            response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
            countyCourtJudgment: null,
            settlement: settlement,
            claimantResponse: claimantResponse
          })
          expect(ClaimStatusFlow.dashboardFor(claim)).to.eql('claimant_signed_agreement')
        })
      })

      it('should extract the defendant_counter_signs_settlement_agreement dashboard if the defendant counter signs the agreement', () => {
        const settlement = createSettlement('COUNTERSIGNATURE')

        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          settlementReachedAt: '2020-10-10',
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('defendant_counter_signs_settlement_agreement')
      })

      it('should extract the past_payment_deadline_settlement_agreement dashboard if the defendant counter signs the agreement but the payment is after deadline for set date', () => {
        const paymentIntention = {
          paymentOption: PaymentOption.BY_SPECIFIED_DATE,
          paymentDate: MomentFactory.currentDate().subtract(2, 'days')
        }
        const settlement = {
          partyStatements: [
            {
              type: StatementType.OFFER.value,
              madeBy: MadeBy.DEFENDANT.value,
              offer: {
                content: 'My offer contents here.',
                completionDate: MomentFactory.currentDate().subtract(2, 'days'),
                paymentIntention: paymentIntention
              }
            },
            {
              madeBy: MadeBy.CLAIMANT.value,
              type: StatementType.ACCEPTATION.value
            },
            {
              madeBy: MadeBy.DEFENDANT.value,
              type: 'COUNTERSIGNATURE'
            }
          ]
        }
        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          settlementReachedAt: '2020-10-10',
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('defendant_counter_signs_settlement_agreement')
      })

      it('should extract the past_payment_deadline_settlement_agreement dashboard if the defendant counter signs the agreement but the payment is after deadline for pay by instalments', () => {
        const paymentIntention = {
          paymentOption: PaymentOption.INSTALMENTS,
          repaymentPlan: {
            firstPaymentDate: MomentFactory.currentDate().subtract(2, 'days')
          }
        }
        const settlement = {
          partyStatements: [
            {
              type: StatementType.OFFER.value,
              madeBy: MadeBy.DEFENDANT.value,
              offer: {
                content: 'My offer contents here.',
                completionDate: MomentFactory.currentDate().subtract(2, 'days'),
                paymentIntention: paymentIntention
              }
            },
            {
              madeBy: MadeBy.CLAIMANT.value,
              type: StatementType.ACCEPTATION.value
            },
            {
              madeBy: MadeBy.DEFENDANT.value,
              type: 'COUNTERSIGNATURE'
            }
          ]
        }
        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          countyCourtJudgmentRequestedAt: null,
          settlement: settlement,
          settlementReachedAt: '2020-10-10',
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('defendant_counter_signs_settlement_agreement')
      })

      it('should extract the ccj_by_admission dashboard if the defendant counter signs the agreement but the payment is after deadline for set date and claimant requests ccj', () => {

        const settlement = createSettlement('COUNTERSIGNATURE', MomentFactory.currentDate().subtract(2, 'days'))

        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: '2020-10-10',
          settlement: settlement,
          settlementReachedAt: '2020-10-10',
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('ccj_by_admission')
      })

      it('should extract the ccj_by_admission dashboard if the defendant counter signs the agreement but the payment is after deadline for pay by instalments and claimant requests ccj', () => {
        const settlement = createSettlement('COUNTERSIGNATURE', MomentFactory.currentDate().subtract(2, 'days'), PaymentOption.INSTALMENTS)

        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: '2020-10-10',
          settlement: settlement,
          settlementReachedAt: '2020-10-10',
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('ccj_by_admission')
      })

      it('should extract the past_counter_signature_deadline dashboard if the defendant does not counter signs the agreement in time', () => {
        const settlement = createSettlement('nope', MomentFactory.currentDate().subtract(2, 'days'))
        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          claimantResponse: claimantResponse,
          claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days')
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('past_counter_signature_deadline')
      })

      it('should extract the ccj_by_admission dashboard if the defendant does not counter signs the agreement in time and claimant requests ccj', () => {
        const settlement = createSettlement('nope', MomentFactory.currentDate().subtract(2, 'days'))

        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: '2020-10-10',
          settlement: settlement,
          claimantResponse: claimantResponse,
          claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days')
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('ccj_by_admission')
      })

      it('should extract the defendant_refuses_agreement dashboard if the claimant wants to sign settlement agreement but defendant refuses to sign', () => {
        const settlement = createSettlement('REJECTION')
        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          settlement: settlement,
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('defendant_refuses_agreement')
      })

      it('should extract the ccj_by_admission dashboard if the claimant accepts payment plan, wants to sign settlement agreement but defendant refuses to sign and claimant requests ccj', () => {
        const claimantResponse = {
          type: 'ACCEPTATION',
          formaliseOption: 'SETTLEMENT'
        }
        const settlement = createSettlement('REJECTION')

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: MomentFactory.currentDateTime().subtract(1, 'days'),
          settlement: settlement,
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('ccj_by_admission')
      })

      it('should extract the claimant_signed_agreement dashboard if claimant rejects payment plan and proposes alternative and signs agreement', () => {
        const settlement = createSettlement('nope')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'SETTLEMENT'
        }
        const claimantSignedAgreement = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          claimantResponse: claimantResponse
        }
        expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(claimantSignedAgreement))).to.eql('claimant_signed_agreement')
      })

      it('should extract the claimant_signed_agreement dashboard if claimant rejects payment plan and proposes alternative and wants to sign agreement', () => {
        const settlement = createSettlement('nope')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          formaliseOption: 'SETTLEMENT'
        }
        const claimantSignedAgreement = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          claimantResponse: claimantResponse
        }
        expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(claimantSignedAgreement))).to.eql('claimant_signed_agreement')
      })

      it('should extract the refer_to_judge dashboard if claimant rejects payment plan and proposes alternative and wants the judge to decide', () => {
        const settlement = createSettlement('nope')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'REFER_TO_JUDGE'
        }
        const claimantSignedAgreement = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: null,
          settlement: settlement,
          claimantResponse: claimantResponse
        }
        expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(claimantSignedAgreement))).to.eql('refer_to_judge')
      })

      it('should extract the ccj_by_determination dashboard if claimant rejects payment plan and proposes alternative and wants CCJ', () => {
        const settlement = createSettlement('nope')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'CCJ'
        }
        const claimantSignedAgreement = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: MomentFactory.currentDateTime().subtract(1, 'days'),
          settlement: settlement,
          claimantResponse: claimantResponse
        }
        expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(claimantSignedAgreement))).to.eql('ccj_by_determination')
      })

      it('should extract the claimant_signed_agreement dashboard if claimant rejects claim and proposes alternative', () => {
        const settlement = createSettlement('nope')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'SETTLEMENT'
        }
        const claimantSignedAgreement = {
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          settlement: settlement,
          claimantResponse: claimantResponse
        }
        expect(ClaimStatusFlow.dashboardFor(new Claim().deserialize(claimantSignedAgreement))).to.eql('claimant_signed_agreement')
      })

      it('should extract the defendant_refuses_agreement dashboard if the claimant proposes a new payment plan, wants to sign settlement agreement but defendant refuses to sign', () => {
        const settlement = createSettlement('REJECTION')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          settlement: settlement,
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('defendant_refuses_agreement')
      })

      it('should extract the ccj_by_determination dashboard if the claimant proposes a new payment plan, wants to sign settlement agreement but defendant refuses to sign and claimant requests ccj', () => {
        const settlement = createSettlement('REJECTION')

        const claimantResponse = {
          type: 'ACCEPTATION',
          claimantPaymentIntention: {},
          courtDetermination: {},
          formaliseOption: 'SETTLEMENT'
        }

        const defendantRejectedAgreement = new Claim().deserialize({
          ...fullAdmissionClaim,
          response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
          countyCourtJudgment: {},
          countyCourtJudgmentRequestedAt: MomentFactory.currentDateTime().subtract(1, 'days'),
          settlement: settlement,
          claimantResponse: claimantResponse
        })
        expect(ClaimStatusFlow.dashboardFor(defendantRejectedAgreement)).to.eql('ccj_by_determination')
      })
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
      expect(ClaimStatusFlow.decide(flow, claim)).to.equal('first')
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
    expect(ClaimStatusFlow.decide(flow)).to.eql('fourth')
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
    expect(ClaimStatusFlow.decide(flow)).to.eql('fourth')
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
    expect(() => ClaimStatusFlow.decide(flow)).to.throw(`Two possible paths are valid for a claim, check the flow's logic`)
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
    expect(() => ClaimStatusFlow.decide(flow)).to.throw(`Trying to render an intermediate state with no dashboard, check the flow's logic`)
  })
})
