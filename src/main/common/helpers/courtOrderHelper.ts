import { Claim } from 'claims/models/claim'
import * as config from 'config'
import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { ResponseDraft } from 'features/response/draft/responseDraft'

import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { CourtOrder } from 'common/court-calculations/courtOrder'
import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'
import { Allowance } from 'claims/models/response/statement-of-means/allowance'
import { Party } from 'claims/models/details/yours/Party'
import { PartyType } from 'common/partyType'
import { MomentFactory } from 'shared/momentFactory'
import { Individual } from 'claims/models/details/yours/individual'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { Moment } from 'moment'

export class CourtOrderHelper {

  static createCourtOrder (claim: Claim, draft: DraftClaimantResponse | ResponseDraft): CourtOrder {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const claimPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
    const draftPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft)

    const defendantMonthlyInstalmentAmount: number = claimPaymentPlan.convertTo(Frequency.MONTHLY).instalmentAmount
    const claimantMonthlyInstalmentAmount: number = draftPaymentPlan.convertTo(Frequency.MONTHLY).instalmentAmount

    const defendant = claim.response.defendant as Individual | SoleTrader
    const defendantDOB: Moment = getDateOfBirth(defendant)
    const allowancesLookup: Allowance = new Allowance().deserialize(JSON.parse(config.get<string>('meansAllowances')))

    const statementOfMeansCalculations: StatementOfMeansCalculations =
      new StatementOfMeansCalculations(defendant.type, defendantDOB, allowancesLookup)
    const defendantMonthlyDisposableIncome: number = statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(claimResponse.statementOfMeans)

    const courtOrder: CourtOrder = new CourtOrder(
      defendantMonthlyInstalmentAmount,
      claimantMonthlyInstalmentAmount,
      defendantMonthlyDisposableIncome
    )

    return courtOrder
  }
}

function getDateOfBirth (defendant: Party): Moment {
  if (defendant.type === PartyType.INDIVIDUAL.value) {
    return MomentFactory.parse((defendant as Individual).dateOfBirth)
  }
  return undefined
}
