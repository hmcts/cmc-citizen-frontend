import { Claim } from 'claims/models/claim'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('ClaimStatusFlow')

const payBySetDate = {
  description: 'Claim is Pay By Set Date',
  isValidFor: (claim) => claim.isPayBySetDate
}

const payImmediately = {
  description: 'Claim is Pay Immediately',
  isValidFor: (claim) => claim.isPayImmediately
}

const payByInstalments = {
  description: 'Claim is Pay By Instalments',
  isValidFor: (claim) => claim.isPayByInstalments
}

function signSettlementAgreementFlow (type: string): ClaimStatusNode[] {
  return [
    {
      description: 'Claimant signed agreement',
      dashboard: `claimant_signed_agreement`,
      isValidFor: (claim) => {
        return (claim.hasClaimantAcceptedOfferAndSignedSettlementAgreement() || claim.hasClaimantSignedSettlementAgreementChosenByCourt()) && claim.settlement
      },
      next: [
        {
          description: 'Defendant counter-signs the settlement agreement',
          dashboard: `defendant_counter_signs_settlement_agreement`,
          isValidFor: (claim) => claim.isSettled,
          next: [
            {
              description: 'Past payment deadline during settlement agreement',
              dashboard: `defendant_counter_signs_settlement_agreement`,
              isValidFor: (claim) => claim.hasBreachedSettlementTerms,
              next: [
                {
                  description: `CCJ by ${type} when past payment deadline during settlement agreement`,
                  dashboard: `ccj_by_${type}`,
                  isValidFor: (claim) => claim.hasCCJBeenRequested,
                  next: []
                }
              ]
            }
          ]
        },
        {
          description: `Past ${type} counter-signature deadline`,
          dashboard: `past_counter_signature_deadline`,
          isValidFor: (claim) => claim.hasDefendantNotSignedSettlementAgreementInTime() && !claim.isSettled,
          next: [
            {
              description: `Claimants requested CCJ by ${type} when past counter-signature deadline`,
              dashboard: `ccj_by_${type}`,
              isValidFor: (claim) => claim.hasCCJBeenRequested,
              next: []
            }
          ]
        },
        {
          description: 'Defendant refuses to sign settlement agreement',
          dashboard: `defendant_refuses_agreement`,
          isValidFor: (claim) => claim.isSettlementAgreementRejected(),
          next: [
            {
              description: `CCJ by ${type} when reject settlement agreement`,
              dashboard: `ccj_by_${type}`,
              isValidFor: (claim) => claim.hasCCJBeenRequested,
              next: []
            }
          ]
        }
      ]
    }
  ]
}

const paymentPlanFlow: ClaimStatusNode[] = [{
  description: 'Claimant accepts repayment plan',
  dashboard: `claimant_accepted_repayment_plan`,
  isValidFor: (claim) => claim.hasClaimantAccepted && !claim.hasAlternativePaymentIntention,
  next: [
    {
      description: 'Claimant wants to sign settlement agreement by admission',
      dashboard: 'claimants_wants_to_sign_settlement_agreement',
      isValidFor: (claim) => claim.hasClaimantAcceptedDefendantResponseWithSettlement(),
      next: signSettlementAgreementFlow('admission')
    },
    {
      description: 'Claimant wants CCJ by admission when accepting payment plan',
      dashboard: 'ccj_admission_accept_payment_plan',
      isValidFor: (claim) => claim.isCCJ && !claim.settlement,
      next: []
    }
  ]
}, {
  description: 'Claimant suggests counter repayment plan',
  dashboard: 'suggest_counter_repayment_plan',
  isValidFor: (claim) => claim.hasClaimantAccepted && claim.hasAlternativePaymentIntention,
  next: [
    {
      description: 'Sign settlement agreement by determination',
      dashboard: 'claimant_signed_agreement',
      isValidFor: (claim) => claim.isSettlement && !claim.isReferToJudge && !claim.isCCJ,
      next: signSettlementAgreementFlow('determination')
    },
    {
      description: 'Refer to Judge',
      dashboard: 'refer_to_judge',
      isValidFor: (claim) => !claim.isSettlementReachedThroughAdmission() && claim.isReferToJudge && !claim.hasCCJBeenRequested,
      next: []
    },
    {
      description: 'Claimants requests CCJ by determination',
      dashboard: 'ccj_by_determination',
      isValidFor: (claim) => !claim.isSettlementReachedThroughAdmission() && claim.isCCJ && claim.hasCCJBeenRequested,
      next: []
    }
  ]
}]
export class ClaimStatusFlow {

  static readonly flow: ClaimStatusNode = {
    description: 'Claim Exists',
    isValidFor: () => true,
    next: [
      {
        description: 'Claim Issued',
        isValidFor: (claim) => !claim.response && !claim.moreTimeRequested && !claim.isResponsePastDeadline && !claim.hasCCJBeenRequested,
        dashboard: 'claim_issued',
        next: []
      },
      {
        description: 'CCJ has been requested',
        isValidFor: (claim) => !claim.response && claim.hasCCJBeenRequested,
        dashboard: 'ccj_requested',
        next: []
      },
      {
        description: 'More Time Requested',
        isValidFor: (claim) => !claim.response && claim.moreTimeRequested && !claim.isResponsePastDeadline && !claim.hasCCJBeenRequested,
        dashboard: 'more_time_requested',
        next: []
      },
      {
        description: 'No response after deadline',
        isValidFor: (claim) => !claim.response && claim.isResponsePastDeadline && !claim.hasCCJBeenRequested,
        dashboard: 'past_response_deadline',
        next: [
          {
            description: 'CCJ by admission when past response deadline',
            dashboard: 'ccj_requested',
            isValidFor: (claim) => claim.hasCCJBeenRequested,
            next: []
          }
        ]
      },
      {
        description: 'Claim has been paid',
        isValidFor: (claim) => !!claim.moneyReceivedOn,
        dashboard: 'claim_settled',
        next: []
      },
      {
        description: 'Claim is Full Admission',
        isValidFor: (claim) => claim.isFullAdmission && !claim.moneyReceivedOn,
        next: [
          {
            ...payImmediately,
            dashboard: 'pay_immediately',
            next: [{
              description: 'Claim is Past the Payment deadline',
              isValidFor: (claim) => claim.isPaymentPastDeadline,
              dashboard: 'pay_immediately',
              next: [
                {
                  description: 'CCJ by admission when past payment deadline',
                  dashboard: 'ccj_requested',
                  isValidFor: (claim) => claim.hasCCJBeenRequested,
                  next: []
                }
              ]
            }]},
          {
            ...payBySetDate,
            dashboard: 'pay_by_set_date',
            next: paymentPlanFlow
          },
          {
            ...payByInstalments,
            dashboard: 'pay_by_instalments',
            next: paymentPlanFlow
          }
        ]
      },
      {
        description: 'Everything else (to be implemented)',
        isValidFor: (claim) => claim.response && !claim.isResponsePastDeadline && !claim.isFullAdmission,
        dashboard: '',
        next: []
      }
    ]
  }

  static decide (flow: ClaimStatusNode, claim?: Claim): string {
    if (flow.isValidFor(claim)) {
      const nextPossibleConditions = (flow.next || []).filter(state => state.isValidFor(claim))
      if (nextPossibleConditions.length > 1) {
        throw new Error(`Two possible paths are valid for a claim, check the flow's logic: { ${nextPossibleConditions.map(a => a.description).join(', ')}}`)
      }
      if (nextPossibleConditions.length === 0) {
        if (!flow.dashboard) {
          throw new Error(`Trying to render an intermediate state with no dashboard, check the flow's logic: ${flow.description}`)
        }
        return flow.dashboard
      }
      return this.decide(nextPossibleConditions[0], claim)
    }
  }

// the try/catch should be removed once we don't need backward compatibility with 'old' dashboards - it's here to make sure we render the
// old status in case there are problems with the new one (which should be addressed)
  public static dashboardFor (claim: Claim): string {
    try {
      return this.decide(ClaimStatusFlow.flow, claim)
    } catch (err) {
      logger.error(err)
      return ''
    }
  }
}

export interface ClaimStatusNode {
  description: string
  dashboard?: string
  isValidFor: (claim) => boolean
  next: ClaimStatusNode[]
}
