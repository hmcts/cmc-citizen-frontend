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

function createDraftClaimantResponseWithCourtDecisionType (claimantPI: any,decisionType: DecisionType,formaliseOption: FormaliseRepaymentPlanOption): DraftClaimantResponse {
  const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.YES,10,100)
  draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(formaliseOption)
  draftClaimantResponse.acceptPaymentMethod = new AcceptPaymentMethod(YesNoOption.NO)
  draftClaimantResponse.courtDecisionType = decisionType
  draftClaimantResponse.alternatePaymentMethod = DraftPaymentIntention.deserialise(claimantPI)
  draftClaimantResponse.courtOfferedPaymentIntention = PaymentIntention.deserialize(courtPaymentIntention)
  draftClaimantResponse.disposableIncome = 200
  draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.YES)
  return draftClaimantResponse
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
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      expect(converter.covertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'rejection',
        'amountPaid': 10,
        'freeMediation': true
      })

    })

    it('rejection with mediation ', () => {
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      draftClaimantResponse.rejectionReason = new RejectionReason('rejected')
      expect(converter.covertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'rejection',
        'amountPaid': 10,
        'freeMediation': true,
        'reason': 'rejected'
      })

    })
  })

  describe('Claimant Acceptance', () => {

    it(' Accept defendant offer with CCJ', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      draftClaimantResponse.courtDecisionType = DecisionType.DEFENDANT
      expect(converter.covertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'acceptation',
        'amountPaid': 10,
        'formaliseOption': 'CCJ'
      })

    })

    it(' Accept defendant offer with settlement', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      draftClaimantResponse.courtDecisionType = DecisionType.DEFENDANT
      expect(converter.covertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'acceptation',
        'amountPaid': 10,
        'formaliseOption': 'SETTLEMENT'
      })

    })

    it(' Accept defendant offer with no formalise option', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,null)
      draftClaimantResponse.courtDecisionType = DecisionType.DEFENDANT
      const errMsg = 'Unknown state of draftClaimantResponse'
      expect(() => converter.covertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Accept defendant offer with no unknown formalise option', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.courtDecisionType = DecisionType.DEFENDANT
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('xyz', 'xyz'))
      const errMsg = 'Unknown formalise repayment option xyz'
      expect(() => converter.covertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Accept court decision with ccj', () => {
      expect(converter.covertToClaimantResponse(createDraftClaimantResponseWithCourtDecisionType(intentionOfImmediatePayment,DecisionType.COURT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
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
      expect(converter.covertToClaimantResponse(createDraftClaimantResponseWithCourtDecisionType(intentionOfPaymentInFullBySetDate,DecisionType.DEFENDANT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
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
      expect(converter.covertToClaimantResponse(createDraftClaimantResponseWithCourtDecisionType(intentionOfPaymentByInstallments,DecisionType.CLAIMANT,FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT))).to.deep.eq(
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
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(intentionOfImmediatePayment,DecisionType.COURT,FormaliseRepaymentPlanOption.REFER_TO_JUDGE)
      draftClaimantResponse.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.covertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
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

    it(' claimant payment intention missing where the decision type is CLAIMANT', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.courtDecisionType = DecisionType.CLAIMANT
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      const errMsg = 'claimant payment intention not found where decision type is CLAIMANT'
      expect(() => converter.covertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Court payment intention missing where the decision type is COURT', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      draftClaimantResponse.courtDecisionType = DecisionType.COURT
      const errMsg = 'court payment intention not found where decision type is COURT'
      expect(() => converter.covertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

  })
})
