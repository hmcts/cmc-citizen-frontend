import { Settlement } from 'claims/models/settlement'
import { PartyStatement } from 'claims/models/partyStatement'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { generatePaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { Offer } from 'claims/models/offer'
import { Moment } from 'moment'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { Claim } from 'claims/models/claim'
import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import { PaymentScheduleTypeViewFilter } from 'claimant-response/filters/payment-schedule-type-view-filter'
import { YesNoOption } from 'models/yesNoOption'
import { PaymentIntentionConverter } from 'claimant-response/helpers/paymentIntentionConverter'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { ResponseType } from 'claims/models/response/responseType'

export function getRepaymentPlanOrigin (settlement: Settlement): string {
  if (!settlement) {
    throw new Error('settlement must not be null')
  }

  const partyStatementSuggestingPaymentPlan: PartyStatement = settlement.partyStatements.slice(-2)[0]
  if (!partyStatementSuggestingPaymentPlan) {
    throw new Error('partyStatement must not be null')
  }

  return partyStatementSuggestingPaymentPlan.madeBy
}

export function prepareSettlement (claim: Claim, draft: DraftClaimantResponse): Settlement {
  if (draft.settlementAgreement && draft.settlementAgreement.signed) {
    const defendantPaymentMethod: PaymentIntention = (claim.response as FullAdmissionResponse | PartialAdmissionResponse).paymentIntention
    const partyStatements: PartyStatement[] = [prepareDefendantPartyStatement(prepareOffer(claim, defendantPaymentMethod))]

    switch (draft.acceptPaymentMethod.accept) {
      case YesNoOption.YES:
        partyStatements.push(acceptOffer())
        break
      case YesNoOption.NO:
        partyStatements.push(rejectOffer())
        const claimantPaymentMethod: PaymentIntention = PaymentIntentionConverter.convertFromDraft(draft.alternatePaymentMethod)
        partyStatements.push(prepareClaimantPartyStatement(prepareOffer(claim, claimantPaymentMethod)))
        partyStatements.push(acceptOffer())
        break
    }

    return new Settlement(partyStatements)
  }
  throw new Error('SettlementAgreement should be signed by claimant')
}

function prepareClaimantPartyStatement (offer: Offer): PartyStatement {
  return new PartyStatement(StatementType.OFFER.value, MadeBy.CLAIMANT.value, offer)
}

function prepareDefendantPartyStatement (offer: Offer): PartyStatement {
  return new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value, offer)
}

function prepareOffer (claim: Claim, paymentIntention: PaymentIntention): Offer {
  const amount: number = claim.response.responseType === ResponseType.PART_ADMISSION ? claim.response.amount : claim.claimData.amount.totalAmount()

  const content: string = prepareContent(claim.claimData.claimant.name, claim.claimData.defendant.name, paymentIntention)
  const completionDate: Moment = paymentIntention.paymentOption === PaymentOption.INSTALMENTS ?
    calculateLastInstalmentPaymentDate(amount, paymentIntention.repaymentPlan) : paymentIntention.paymentDate

  return new Offer(content, completionDate, paymentIntention)
}

function prepareContent (claimantName: string, defendantName: string, paymentIntention: PaymentIntention): string {
  switch (paymentIntention.paymentOption) {
    case PaymentOption.IMMEDIATELY:
      return `${defendantName} will pay the full amount immediately. ${claimantName} will receive the money no later than ${MomentFormatter.formatLongDate(paymentIntention.paymentDate)}. Any cheques or transfers will be clear in their account by this date.`
    case PaymentOption.BY_SPECIFIED_DATE:
      return `${defendantName} will pay the full amount, no later than ${MomentFormatter.formatLongDate(paymentIntention.paymentDate)}`
    case PaymentOption.INSTALMENTS:
      return `${defendantName} will pay instalments of ${NumberFormatter.formatMoney(paymentIntention.repaymentPlan.instalmentAmount)} ${PaymentScheduleTypeViewFilter.render(paymentIntention.repaymentPlan.paymentSchedule).toLowerCase()}. The first instalment will be paid by ${MomentFormatter.formatLongDate(paymentIntention.repaymentPlan.firstPaymentDate)}.`
    default:
      throw new Error(`Unsupported payment option: ${paymentIntention.paymentOption}`)
  }
}

function calculateLastInstalmentPaymentDate (amount: number, repaymentPlan: RepaymentPlan): Moment {
  return generatePaymentPlan(amount, repaymentPlan).getLastPaymentDate(repaymentPlan.firstPaymentDate)
}

function acceptOffer (): PartyStatement {
  return new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
}

function rejectOffer (): PartyStatement {
  return new PartyStatement(StatementType.REJECTION.value, MadeBy.CLAIMANT.value)
}
