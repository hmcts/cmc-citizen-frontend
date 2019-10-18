import { expect } from 'chai'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ClaimantResponseConverter as converter } from 'claims/converters/claimantResponseConverter'
import { YesNoOption } from 'models/yesNoOption'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { CourtDecision } from 'common/court-calculations/courtDecision'
import { DecisionType } from 'common/court-calculations/decisionType'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import {
  intentionOfPaymentByInstalments,
  intentionOfPaymentInFullBySetDate
 } from 'test/data/draft/paymentIntentionDraft'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import {
  payByInstallmentsIntent,
  payBySetDateIntent,
  payImmediatelyIntent
} from 'test/data/draft/claimantPaymentIntentionDraft'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'

function createDraftClaimantResponseForFullRejection (): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(YesNoOption.NO)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.NO,10,100)
  draftResponse.courtDetermination = new CourtDetermination(
    intentionOfPaymentByInstalments,
    intentionOfPaymentInFullBySetDate,
    new RejectionReason('Rejection reason is..'),
    1000,
    DecisionType.COURT)
  return draftResponse
}

function createDraftClaimantResponseBaseForAcceptance (accept: YesNoOption, settle: YesNoOption): DraftClaimantResponse {
  const draftResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftResponse.settleAdmitted = new SettleAdmitted(settle)
  draftResponse.paidAmount = new PaidAmount(PaidAmountOption.YES,10,100)
  if (accept) draftResponse.acceptPaymentMethod = new AcceptPaymentMethod(accept)
  return draftResponse
}

function createDraftClaimantResponseWithCourtDecisionType (
  claimantPI: DraftPaymentIntention,
  decisionType: DecisionType,
  formaliseOption: FormaliseRepaymentPlanOption,
  courtDecision: CourtDecision,
  courtPaymentIntention: PaymentIntention
): DraftClaimantResponse {
  const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.YES, 10, 100)
  draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(formaliseOption)
  draftClaimantResponse.acceptPaymentMethod = new AcceptPaymentMethod(YesNoOption.NO)
  if (claimantPI) draftClaimantResponse.alternatePaymentMethod = claimantPI
  draftClaimantResponse.courtDetermination = new CourtDetermination(
    courtDecision,
    courtPaymentIntention,
    undefined,
    1000,
    decisionType)
  draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.YES)
  return draftClaimantResponse
}

describe('claimant response converter', () => {
  const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)
  const mediationDraft = new MediationDraft().deserialize({
    youCanOnlyUseMediation: {
      option: FreeMediationOption.YES
    },
    canWeUseCompany: {
      option: FreeMediationOption.YES,
      mediationPhoneNumberConfirmation: '07777777788',
      mediationContactPerson: 'Mary Richards'
    }})

  if (FeatureToggles.isEnabled('mediation')) {
    describe('Claimant Rejection', () => {
      it('rejection with mediation missing ', () => {
        const mediationDraft = new MediationDraft().deserialize({
          youCanOnlyUseMediation: {
            option: FreeMediationOption.NO
          }
        })

        expect(converter.convertToClaimantResponse(claim, createDraftClaimantResponseForFullRejection(), mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'amountPaid': 10,
          'reason': 'Rejection reason is..',
          'freeMediation': 'no',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': undefined
        })
      })

      it('rejection with mediation', () => {
        const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
        draftClaimantResponse.freeMediation = new FreeMediation('yes')
        expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'amountPaid': 10,
          'freeMediation': 'yes',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': '07777777788',
          'reason': 'Rejection reason is..'
        })

      })

      it('rejection with mediation with reason', () => {
        const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
        draftClaimantResponse.courtDetermination.rejectionReason = new RejectionReason('rejected')
        expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'amountPaid': 10,
          'freeMediation': 'yes',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': '07777777788',
          'reason': 'rejected'
        })
      })

      it('rejection with mediation with nil amount paid', () => {
        const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
        draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.NO)
        draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.NO, 0, 100)
        draftClaimantResponse.freeMediation = new FreeMediation('yes')
        draftClaimantResponse.courtDetermination = new CourtDetermination(
          intentionOfPaymentByInstalments,
          intentionOfPaymentInFullBySetDate,
          new RejectionReason('Rejection reason is..'),
          1000,
          DecisionType.COURT)
        expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'amountPaid': 0,
          'freeMediation': 'yes',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': '07777777788',
          'reason': 'Rejection reason is..'
        })
      })

      it('rejection from non acceptance of states paid', () => {
        const draftClaimantResponse = new DraftClaimantResponse()
        draftClaimantResponse.accepted = new ClaimSettled(YesNoOption.NO)
        draftClaimantResponse.partPaymentReceived = new PartPaymentReceived(YesNoOption.YES)
        draftClaimantResponse.freeMediation = new FreeMediation('yes')
        draftClaimantResponse.rejectionReason = new RejectionReason('OBJECTION!')

        expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'freeMediation': 'yes',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': '07777777788',
          'paymentReceived': 'yes',
          'settleForAmount': 'no',
          'reason': 'OBJECTION!'
        })
      })

      it('Should convert to rejection when given a no option in part payment received', () => {
        const draftClaimantResponse = new DraftClaimantResponse()
        draftClaimantResponse.partPaymentReceived = new PartPaymentReceived(YesNoOption.NO)
        draftClaimantResponse.freeMediation = new FreeMediation('yes')

        expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
          'type': 'REJECTION',
          'freeMediation': 'yes',
          'mediationContactPerson': undefined,
          'mediationPhoneNumber': '07777777788',
          'paymentReceived': 'no'
        })
      })
    })
  }

  describe('Claimant Acceptance', () => {
    it('Accept defendant offer with CCJ', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'CCJ'
      })

    })

    it('Accept defendant offer with settlement', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'SETTLEMENT'
      })

    })

    it('Accept defendant offer with unknown formalise option', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.courtDetermination = new CourtDetermination(null,null,null,null,DecisionType.DEFENDANT)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('xyz', 'xyz'))
      const errMsg = 'Unknown formalise repayment option xyz'
      expect(() => converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.throw(Error, errMsg)
    })

    it('Accept defendant offer but propose a counter repayment plan to pay immediately', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payImmediatelyIntent,
        DecisionType.DEFENDANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentInFullBySetDate,
        intentionOfPaymentInFullBySetDate)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentInFullBySetDate,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            disposableIncome: 1000,
            decisionType: DecisionType.DEFENDANT
          }
        })
    })

    it('Accept defendant offer but propose a counter repayment plan to pay by set date', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payBySetDateIntent,
        DecisionType.DEFENDANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentInFullBySetDate,
        intentionOfPaymentInFullBySetDate)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'BY_SPECIFIED_DATE',
            'paymentDate': new LocalDate(2018, 12, 31).toMoment()
          },
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentInFullBySetDate,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            disposableIncome: 1000,
            decisionType: DecisionType.DEFENDANT
          }
        })
    })

    it('Accept defendant offer but propose a counter repayment plan to pay by instalments', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payByInstallmentsIntent,
        DecisionType.DEFENDANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentInFullBySetDate,
        intentionOfPaymentInFullBySetDate)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'INSTALMENTS',
            'repaymentPlan': {
              'firstPaymentDate': new LocalDate(2018, 12, 31).toMoment(),
              'instalmentAmount': 100,
              'paymentSchedule': 'EVERY_MONTH',
              'paymentLength': '',
              'completionDate': new LocalDate(2019, 12, 30).toMoment()
            }
          },
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentInFullBySetDate,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            disposableIncome: 1000,
            decisionType: DecisionType.DEFENDANT
          }
        })
    })

    it('Claimant proposes immediate payment court decides pay by set date', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payImmediatelyIntent,
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentInFullBySetDate,
        intentionOfPaymentByInstalments)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentInFullBySetDate,
            courtPaymentIntention: intentionOfPaymentByInstalments,
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          }
        })
    })

    it('Accept court decision to pay by instalments with ccj', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payImmediatelyIntent,
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentByInstalments,
        intentionOfPaymentByInstalments)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentByInstalments,
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          }
        })
    })

    it('Accept court decision favouring defendant payment intent', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payBySetDateIntent,
        DecisionType.DEFENDANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentByInstalments,
        intentionOfPaymentInFullBySetDate)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'BY_SPECIFIED_DATE',
            'paymentDate': new LocalDate(2018, 12, 31).toMoment()
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            disposableIncome: 1000,
            decisionType: DecisionType.DEFENDANT
          },
          'formaliseOption': 'CCJ'
        })
    })

    it('Accept court decision favouring claimant payment intent', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payByInstallmentsIntent,
        DecisionType.CLAIMANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
        intentionOfPaymentByInstalments,
        intentionOfPaymentInFullBySetDate)
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'claimantPaymentIntention': {
            'paymentOption': 'INSTALMENTS',
            'repaymentPlan': {
              'firstPaymentDate': new LocalDate(2018, 12, 31).toMoment(),
              'instalmentAmount': 100,
              'paymentSchedule': 'EVERY_MONTH',
              'paymentLength': '',
              'completionDate': new LocalDate(2019, 12, 30).toMoment()
            }
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            disposableIncome: 1000,
            decisionType: DecisionType.CLAIMANT
          }
        })
    })

    it('Reject court decision to pay by set date and refer to judge', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payImmediatelyIntent,
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REFER_TO_JUDGE,
        intentionOfPaymentInFullBySetDate,
        intentionOfPaymentByInstalments)
      draftClaimantResponse.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentInFullBySetDate,
            courtPaymentIntention: intentionOfPaymentByInstalments,
            rejectionReason: 'rejected reason',
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          },
          'formaliseOption': 'REFER_TO_JUDGE'
        })
    })

    it('Reject court decision to pay by instalments and refer to judge', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        payImmediatelyIntent,
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REFER_TO_JUDGE,
        intentionOfPaymentByInstalments,
        intentionOfPaymentInFullBySetDate)
      draftClaimantResponse.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,false)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            rejectionReason: 'rejected reason',
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          },
          'formaliseOption': 'REFER_TO_JUDGE'
        })
    })

    it('If defendant is a business and claimant rejects defendant payment plan for alternative means then refer to judge', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.YES, YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REFER_TO_JUDGE)
      draftClaimantResponse.alternatePaymentMethod = payImmediatelyIntent
      draftClaimantResponse.paidAmount = undefined
      expect(converter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft,true)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'claimantPaymentIntention': {
            'paymentOption': 'IMMEDIATELY',
            'paymentDate': MomentFactory.currentDate().add(5,'days')
          },
          'formaliseOption': 'REFER_TO_JUDGE'
        })
    })
  })
})
