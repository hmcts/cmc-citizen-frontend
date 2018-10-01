import { expect } from 'chai'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ClaimantResponseConverter as converter } from 'claims/converters/claimantResponseConverter'
import { YesNoOption } from 'models/yesNoOption'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { FreeMediation } from 'response/form/models/freeMediation'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { DecisionType } from 'common/court-calculations/courtDetermination'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import {
  intentionOfImmediatePayment,
  intentionOfPaymentByInstallments,
  intentionOfPaymentInFullBySetDate
} from '../../../data/draft/paymentIntentionDraft'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { LocalDate } from 'forms/models/localDate'

function createDraftClaimantResponseForFullRejection (): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(YesNoOption.NO)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.NO,10,100)
  return draftResponse
}
function createDCRBaseForAcceptance (): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(YesNoOption.YES)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.YES,10,100)
  return draftResponse
}
const courtPaymentIntention = {
  paymentOption: PaymentOption.INSTALMENTS,
  paymentDate: MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan:  {
    instalmentAmount: 10,
    firstPaymentDate: MomentFactory.currentDate().add(30, 'days'),
    paymentSchedule: PaymentSchedule.EVERY_MONTH,
    completionDate: MomentFactory.currentDate().add(300, 'days'),
    paymentLength: '3 Months'
  }}

const courtDecisionInstalments = {
  'courtDecision': {
    'paymentOption': 'INSTALMENTS',
    'paymentDate': MomentFactory.currentDate().add(5, 'days'),
    'repaymentPlan' : {
      'instalmentAmount': 10,
      'firstPaymentDate': MomentFactory.currentDate().add(30, 'days'),
      'paymentSchedule': 'EVERY_MONTH',
      'completionDate': MomentFactory.currentDate().add(300, 'days'),
      'paymentLength': '3 Months'
    }
  }
}

function createDCRWithCourtDecisionType (claimantPI: any,decisionType: DecisionType,formaliseOption: FormaliseRepaymentPlanOption): DraftClaimantResponse {
  const dcr: DraftClaimantResponse = new DraftClaimantResponse()
  dcr.paidAmount = new PaidAmount(PaidAmountOption.YES,10,100)
  dcr.formaliseRepaymentPlan = new FormaliseRepaymentPlan(formaliseOption)
  dcr.courtDecisionType = decisionType
  dcr.alternatePaymentMethod = DraftPaymentIntention.deserialise(claimantPI)
  dcr.courtOfferedPaymentIntention = PaymentIntention.deserialize(courtPaymentIntention)
  dcr.disposableIncome = 200
  return dcr
}
describe('claimant response converter ',() => {
  describe('Claimant Rejection', () => {
    it('rejection with mediation missing ', () => {
      expect(converter.covertToClaimantResponse(createDraftClaimantResponseForFullRejection())).to.deep.eq({
        'type': 'rejection',
        'amountPaid': 10
      })

    })

    it('rejection with mediation ', () => {
      const dcr = createDraftClaimantResponseForFullRejection()
      dcr.freeMediation = new FreeMediation('yes')
      expect(converter.covertToClaimantResponse(dcr)).to.deep.eq({
        'type': 'rejection',
        'amountPaid': 10,
        'freeMediation': true
      })

    })

    it('rejection with mediation ', () => {
      const dcr = createDraftClaimantResponseForFullRejection()
      dcr.freeMediation = new FreeMediation('yes')
      dcr.rejectionReason = new RejectionReason('rejected')
      expect(converter.covertToClaimantResponse(dcr)).to.deep.eq({
        'type': 'rejection',
        'amountPaid': 10,
        'freeMediation': true,
        'reason': 'rejected'
      })

    })
  })

  describe('Claimant Acceptance', () => {

    it(' Accept defendant offer with CCJ', () => {
      const dcr = createDCRBaseForAcceptance()
      dcr.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      dcr.courtDecisionType = DecisionType.DEFENDANT
      expect(converter.covertToClaimantResponse(dcr)).to.deep.eq({
        'type': 'acceptation',
        'amountPaid': 10,
        'formaliseOption': 'CCJ',
        'decisionType': 'DEFENDANT'
      })

    })

    it(' Accept defendant offer with settlement', () => {
      const dcr = createDCRBaseForAcceptance()
      dcr.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      dcr.courtDecisionType = DecisionType.DEFENDANT
      expect(converter.covertToClaimantResponse(dcr)).to.deep.eq({
        'type': 'acceptation',
        'amountPaid': 10,
        'formaliseOption': 'SETTLEMENT',
        'decisionType': 'DEFENDANT'
      })

    })

    it(' Accept defendant offer with no formalise option', () => {
      const dcr = createDCRBaseForAcceptance()
      dcr.courtDecisionType = DecisionType.DEFENDANT
      const errMsg = 'Unknown state of draftClaimantResponse'
      expect(() => converter.covertToClaimantResponse(dcr)).to.throw(Error, errMsg)
    })

    it(' Accept defendant offer with no unknown formalise option', () => {
      const dcr = createDCRBaseForAcceptance()
      dcr.courtDecisionType = DecisionType.DEFENDANT
      dcr.formaliseRepaymentPlan = new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('xyz', 'xyz'))
      const errMsg = 'Unknown formalise repayment option xyz'
      expect(() => converter.covertToClaimantResponse(dcr)).to.throw(Error, errMsg)
    })

    it(' Accept court decision with ccj', () => {
      expect(converter.covertToClaimantResponse(createDCRWithCourtDecisionType(intentionOfImmediatePayment,DecisionType.COURT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
        {
          'type': 'acceptation',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY'
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            'disposableIncome': 200
          },
          'formaliseOption': 'CCJ',
          'decisionType': 'COURT'
        })
    })

    it(' Accept court decision favouring defendant payment intent ', () => {
      expect(converter.covertToClaimantResponse(createDCRWithCourtDecisionType(intentionOfPaymentInFullBySetDate,DecisionType.DEFENDANT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
        {
          'type': 'acceptation',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'BY_SPECIFIED_DATE',
            'paymentDate': new LocalDate(2018,12,31).toMoment()
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            'disposableIncome': 200
          },
          'formaliseOption': 'CCJ',
          'decisionType': 'DEFENDANT'
        })
    })

    it(' Accept court decision favouring claimant payment intent ', () => {
      expect(converter.covertToClaimantResponse(createDCRWithCourtDecisionType(intentionOfPaymentByInstallments,DecisionType.CLAIMANT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
        {
          'type': 'acceptation',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'INSTALMENTS',
            'repaymentPlan': {
              'firstPaymentDate': new LocalDate(2018,12,31).toMoment(),
              'instalmentAmount': 100,
              'paymentSchedule': 'EVERY_MONTH'
            }
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            'disposableIncome': 200
          },
          'formaliseOption': 'CCJ',
          'decisionType': 'CLAIMANT'
        })
    })

    it(' Reject court decision and refer to judge ', () => {
      const dcr = createDCRWithCourtDecisionType(intentionOfImmediatePayment,DecisionType.COURT,FormaliseRepaymentPlanOption.REFER_TO_JUDGE)
      dcr.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.covertToClaimantResponse(dcr)).to.deep.eq(
        {
          'type': 'acceptation',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY'
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            'disposableIncome': 200,
            'rejectionReason': 'rejected reason'
          },
          'formaliseOption': 'REFER_TO_JUDGE',
          'decisionType': 'COURT'
        })
    })

  })
})
