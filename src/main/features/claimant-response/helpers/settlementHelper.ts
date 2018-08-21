import { Settlement } from 'claims/models/settlement'
import { PartyStatement } from 'claims/models/partyStatement'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
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
    const partyStatements: PartyStatement[] = [prepareDefendantPartyStatement(claim), acceptOffer()]
    return new Settlement(partyStatements)
  }
  throw new Error('SettlementAgreement should be signed by claimant')
}

export function prepareDefendantPartyStatement (claim: Claim): PartyStatement {
  const offer: Offer = prepareDefendantOffer(claim)
  return new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value, offer)
}

export function prepareDefendantOffer (claim: Claim): Offer {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  if (response.paymentIntention.paymentDate) {
    const completionDate: Moment = response.paymentIntention.paymentDate
    const content: string = `${response.defendant.name} will pay the full amount, no later than ${MomentFormatter.formatLongDate(completionDate)}`
    return new Offer(content, completionDate, response.paymentIntention)
  } else if (response.paymentIntention.repaymentPlan) {
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
    const instalmentAmount: string = NumberFormatter.formatMoney(paymentPlan.instalmentAmount)
    const paymentSchedule: string = PaymentScheduleTypeViewFilter.render(response.paymentIntention.repaymentPlan.paymentSchedule)
    const firstPaymentDate: string = MomentFormatter.formatLongDate(paymentPlan.startDate)
    const completionDate: Moment = paymentPlan.calculateLastPaymentDate()
    const content: string = `${response.defendant.name} will pay instalments of ${instalmentAmount} ${paymentSchedule}. The first instalment will be paid by ${firstPaymentDate}.`
    return new Offer(content, completionDate, response.paymentIntention)
  }
  throw new Error('Invalid paymentIntention')
}

export function acceptOffer (): PartyStatement {
  return new PartyStatement(StatementType.ACCEPTATION.value, MadeBy.CLAIMANT.value)
}
