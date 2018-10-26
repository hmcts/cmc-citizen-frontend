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
import { DecisionType } from 'common/court-calculations/courtDecision'
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
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'

function createDraftClaimantResponseForFullRejection (): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(YesNoOption.NO)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.NO,10,100)
  return draftResponse
}

function createDraftClaimantResponseBaseForAcceptance (accept: YesNoOption, settle: YesNoOption): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(settle)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.YES,10,100)
  if (accept) draftResponse.acceptPaymentMethod = new AcceptPaymentMethod(accept)
  return draftResponse
}

const paymentIntentionInInstallment = {
  paymentOption: PaymentOption.INSTALMENTS,
  paymentDate: MomentFactory.currentDate().add(5, 'days'),
  repaymentPlan: {
    instalmentAmount: 10,
    firstPaymentDate: MomentFactory.currentDate().add(30, 'days'),
    paymentSchedule: PaymentSchedule.EVERY_MONTH,
    completionDate: MomentFactory.currentDate().add(90, 'days'),
    paymentLength: '3 Months'
  }
}

const installmentPaymentIntention = {
  'paymentOption': 'INSTALMENTS',
  'paymentDate': MomentFactory.currentDate().add(5, 'days'),
  'repaymentPlan': {
    'instalmentAmount': 10,
    'firstPaymentDate': MomentFactory.currentDate().add(30, 'days'),
    'paymentSchedule': 'EVERY_MONTH',
    'completionDate': MomentFactory.currentDate().add(90, 'days'),
    'paymentLength': '3 Months'
  }
}

const courtDecisionInstalments = {
  'courtDecision': installmentPaymentIntention
}

const courtPaymentIntentionInstallments = {
  'courtPaymentIntention': installmentPaymentIntention
}

const courtPaymentIntentionBySetDate = {
  'courtPaymentIntention': {
    'paymentOption': 'BY_SPECIFIED_DATE',
    'paymentDate': MomentFactory.currentDate().add(5, 'days'),
    'repaymentPlan': undefined
  }
}

const paymentIntentionByPayBySetDate = {
  paymentOption: PaymentOption.BY_SPECIFIED_DATE,
  paymentDate: MomentFactory.currentDate().add(5, 'days')
}

function createDraftClaimantResponseWithCourtDecisionType (
  claimantPI: any,
  decisionType: DecisionType,
  formaliseOption: FormaliseRepaymentPlanOption,
  courtCalculatedPaymentIntention: any
): DraftClaimantResponse {
  const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.YES, 10, 100)
  draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(formaliseOption)
  draftClaimantResponse.acceptPaymentMethod = new AcceptPaymentMethod(YesNoOption.NO)
  draftClaimantResponse.decisionType = decisionType
  draftClaimantResponse.alternatePaymentMethod = DraftPaymentIntention.deserialize(claimantPI)
  draftClaimantResponse.courtOfferedPaymentIntention = PaymentIntention.deserialize(paymentIntentionInInstallment)
  draftClaimantResponse.courtCalculatedPaymentIntention = PaymentIntention.deserialize(courtCalculatedPaymentIntention)
  draftClaimantResponse.disposableIncome = 200
  draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.YES)
  return draftClaimantResponse
}

describe('claimant response converter ', () => {
  describe('Claimant Rejection', () => {
    it('rejection with mediation missing ', () => {
      expect(converter.convertToClaimantResponse(createDraftClaimantResponseForFullRejection())).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 10
      })

    })

    it('rejection with mediation ', () => {
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 10,
        'freeMediation': true
      })

    })

    it('rejection with mediation with reason', () => {
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      draftClaimantResponse.rejectionReason = new RejectionReason('rejected')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 10,
        'freeMediation': true,
        'reason': 'rejected'
      })
    })

    it('rejection with mediation with nil amount paid', () => {
      const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
      draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.NO)
      draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.NO,0,100)
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 0,
        'freeMediation': true
      })
    })

  })

  describe('Claimant Acceptance', () => {

    it(' Accept defendant offer with CCJ', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      draftClaimantResponse.decisionType = DecisionType.DEFENDANT
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'CCJ'
      })

    })

    it(' Accept defendant offer with settlement', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      draftClaimantResponse.decisionType = DecisionType.DEFENDANT
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'SETTLEMENT'
      })

    })

    it(' Accept defendant offer with no unknown formalise option', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.decisionType = DecisionType.DEFENDANT
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('xyz', 'xyz'))
      const errMsg = 'Unknown formalise repayment option xyz'
      expect(() => converter.convertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Accept court decision with ccj', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(intentionOfImmediatePayment,
        DecisionType.COURT, FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionInInstallment)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            ...courtPaymentIntentionInstallments,
            'disposableIncome': 200,
            'decisionType': 'COURT'
          },
          'formaliseOption': 'CCJ'
        })
    })

    it(' Accept court decision favouring defendant payment intent ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(intentionOfPaymentInFullBySetDate,
        DecisionType.DEFENDANT, FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionInInstallment)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'BY_SPECIFIED_DATE',
            'paymentDate': new LocalDate(2018, 12, 31).toMoment()
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            ...courtPaymentIntentionInstallments,
            'disposableIncome': 200,
            'decisionType': 'DEFENDANT'
          },
          'formaliseOption': 'CCJ'
        })
    })

    it(' Accept court decision favouring claimant payment intent ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(intentionOfPaymentByInstallments,
        DecisionType.CLAIMANT, FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionByPayBySetDate)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'INSTALMENTS',
            'repaymentPlan': {
              'firstPaymentDate': new LocalDate(2018, 12, 31).toMoment(),
              'instalmentAmount': 100,
              'paymentSchedule': 'EVERY_MONTH'
            }
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            ...courtPaymentIntentionBySetDate,
            'disposableIncome': 200,
            'decisionType': 'CLAIMANT'
          },
          'formaliseOption': 'CCJ'
        })
    })

    it(' Reject court decision and refer to judge ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(intentionOfImmediatePayment,
        DecisionType.COURT, FormaliseRepaymentPlanOption.REFER_TO_JUDGE, paymentIntentionInInstallment)

      draftClaimantResponse.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            ...courtDecisionInstalments,
            ...courtPaymentIntentionInstallments,
            'disposableIncome': 200,
            'rejectionReason': 'rejected reason',
            'decisionType': 'COURT'
          },
          'formaliseOption': 'REFER_TO_JUDGE'
        })
    })

    it(' claimant payment intention missing where the decision type is CLAIMANT', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.decisionType = DecisionType.CLAIMANT
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      const errMsg = 'claimant payment intention not found where decision type is CLAIMANT'
      expect(() => converter.convertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Court payment intention missing where the decision type is COURT', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      draftClaimantResponse.decisionType = DecisionType.COURT
      const errMsg = 'court offered payment intention not found where decision type is COURT'
      expect(() => converter.convertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

  })
})
