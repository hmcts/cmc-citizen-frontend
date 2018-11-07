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
import {
  intentionOfPaymentByInstalments,
  intentionOfPaymentInFullBySetDate
} from '../../../data/draft/paymentIntentionDraft'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'

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
  decisionType: DecisionType,
  formaliseOption: FormaliseRepaymentPlanOption
): DraftClaimantResponse {
  const draftClaimantResponse: DraftClaimantResponse = new DraftClaimantResponse()
  draftClaimantResponse.paidAmount = new PaidAmount(PaidAmountOption.YES, 10, 100)
  draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(formaliseOption)
  draftClaimantResponse.acceptPaymentMethod = new AcceptPaymentMethod(YesNoOption.NO)
  draftClaimantResponse.courtDetermination = new CourtDetermination(
    intentionOfPaymentByInstalments,
    intentionOfPaymentInFullBySetDate,
    undefined,
    1000,
    decisionType)
  draftClaimantResponse.settleAdmitted = new SettleAdmitted(YesNoOption.YES)
  return draftClaimantResponse
}

describe('claimant response converter ', () => {
  describe('Claimant Rejection', () => {
    it('rejection with mediation missing ', () => {
      expect(converter.convertToClaimantResponse(createDraftClaimantResponseForFullRejection())).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 10,
        'reason': 'Rejection reason is..'
      })
    })

    it('rejection with mediation ', () => {
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 10,
        'freeMediation': true,
        'reason': 'Rejection reason is..'
      })

    })

    it('rejection with mediation with reason', () => {
      const draftClaimantResponse = createDraftClaimantResponseForFullRejection()
      draftClaimantResponse.freeMediation = new FreeMediation('yes')
      draftClaimantResponse.courtDetermination.rejectionReason = new RejectionReason('rejected')
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
      draftClaimantResponse.courtDetermination = new CourtDetermination(
        intentionOfPaymentByInstalments,
        intentionOfPaymentInFullBySetDate,
        new RejectionReason('Rejection reason is..'),
        1000,
        DecisionType.COURT)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION',
        'amountPaid': 0,
        'freeMediation': true,
        'reason': 'Rejection reason is..'
      })
    })

    it('rejection from non acceptance of states paid', () => {
      const draftClaimantResponse = new DraftClaimantResponse()
      draftClaimantResponse.accepted = new ClaimSettled(YesNoOption.NO)

      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION'
      })
    })

    it('Should convert to rejection when given a no option in part payment recieved', () => {
      const draftClaimantResponse = new DraftClaimantResponse()
      draftClaimantResponse.partPaymentReceived = new PartPaymentReceived(YesNoOption.NO)

      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'REJECTION'
      })
    })

  })

  describe('Claimant Acceptance', () => {
    const courtDetermination: CourtDetermination = new CourtDetermination(
      intentionOfPaymentByInstalments,
      intentionOfPaymentInFullBySetDate,
      undefined,
      1000,
      DecisionType.DEFENDANT)

    it(' Accept defendant offer with CCJ', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      draftClaimantResponse.courtDetermination = courtDetermination
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'CCJ',
        'courtDetermination': {
          courtDecision: intentionOfPaymentByInstalments,
          courtPaymentIntention: intentionOfPaymentInFullBySetDate,
          rejectionReason: undefined,
          disposableIncome: 1000,
          decisionType: DecisionType.DEFENDANT
        }
      })

    })

    it(' Accept defendant offer with settlement', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null,YesNoOption.YES)
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT)
      draftClaimantResponse.courtDetermination = courtDetermination
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq({
        'type': 'ACCEPTATION',
        'amountPaid': 10,
        'formaliseOption': 'SETTLEMENT',
        'courtDetermination': {
          courtDecision: intentionOfPaymentByInstalments,
          courtPaymentIntention: intentionOfPaymentInFullBySetDate,
          rejectionReason: undefined,
          disposableIncome: 1000,
          decisionType: DecisionType.DEFENDANT
        }
      })

    })

    it(' Accept defendant offer with no unknown formalise option', () => {
      const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(YesNoOption.NO,YesNoOption.YES)
      draftClaimantResponse.courtDetermination = courtDetermination
      draftClaimantResponse.formaliseRepaymentPlan = new FormaliseRepaymentPlan(new FormaliseRepaymentPlanOption('xyz', 'xyz'))
      const errMsg = 'Unknown formalise repayment option xyz'
      expect(() => converter.convertToClaimantResponse(draftClaimantResponse)).to.throw(Error, errMsg)
    })

    it(' Accept court decision with ccj', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            rejectionReason: undefined,
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          }
        })
    })

    it(' Accept court decision favouring defendant payment intent ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        DecisionType.DEFENDANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            rejectionReason: undefined,
            disposableIncome: 1000,
            decisionType: DecisionType.DEFENDANT
          }
        })
    })

    it(' Accept court decision favouring claimant payment intent ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        DecisionType.CLAIMANT,
        FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT)
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'CCJ',
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            rejectionReason: undefined,
            disposableIncome: 1000,
            decisionType: DecisionType.CLAIMANT
          }
        })
    })

    it(' Reject court decision and refer to judge ', () => {
      const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(
        DecisionType.COURT,
        FormaliseRepaymentPlanOption.REFER_TO_JUDGE)

      draftClaimantResponse.courtDetermination.rejectionReason = new RejectionReason('rejected reason')
      expect(converter.convertToClaimantResponse(draftClaimantResponse)).to.deep.eq(
        {
          'type': 'ACCEPTATION',
          'amountPaid': 10,
          'formaliseOption': 'REFER_TO_JUDGE',
          'courtDetermination': {
            courtDecision: intentionOfPaymentByInstalments,
            courtPaymentIntention: intentionOfPaymentInFullBySetDate,
            rejectionReason: 'rejected reason',
            disposableIncome: 1000,
            decisionType: DecisionType.COURT
          }
        })
    })
  })
})
