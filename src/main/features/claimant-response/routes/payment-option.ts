import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Frequency } from 'common/frequency/frequency'
import { User } from 'idam/user'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { Draft } from '@hmcts/draft-store-client'
import { AllowanceRepository, ResourceAllowanceRepository } from 'common/allowances/allowanceRepository'
import { AllowanceCalculations } from 'common/allowances/allowanceCalculations'
import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'
import { Party } from 'claims/models/details/yours/party'
import { Moment } from 'moment'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/theirs/individual'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'

export class PaymentOptionPage extends AbstractPaymentOptionPage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtOfferedPaymentIntention = new PaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
        courtOfferedPaymentIntention.paymentOption = PaymentOption.IMMEDIATELY
        courtOfferedPaymentIntention.paymentDate = MomentFactory.currentDate().add(5, 'days')
        return courtOfferedPaymentIntention
      }
      return undefined
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        const defendantFrequency: Frequency = Frequency.of(claimResponse.paymentIntention.repaymentPlan.paymentSchedule)
        const paymentPlanConvertedToDefendantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency)

        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: Math.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount * 100) / 100,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }
        return courtOfferedPaymentIntention
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE

        return courtOfferedPaymentIntention
      }
      return undefined
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        return courtOfferedPaymentIntention
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {

        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        return courtOfferedPaymentIntention
      }
      return undefined
    }
    return undefined
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
    if (!paymentPlan) {
      return undefined
    }

    courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
    courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate()
    return courtCalculatedPaymentIntention
  }

  static getCourtDecision (draft: DraftClaimantResponse, claim: Claim): DecisionType {
    return CourtDecisionHelper.createCourtDecision(claim, draft)
  }

  getView (): string {
    return 'claimant-response/views/payment-option'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod', () => new DraftPaymentIntention())
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId

    if (claim.response.defendant.type === PartyType.COMPANY.value) {
      return Paths.taskListPage.evaluateUri({ externalId: externalId })
    }

    const courtDecision = PaymentOptionPage.getCourtDecision(draft, claim)
    switch (courtDecision) {
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
        }
        break
      }
      case DecisionType.CLAIMANT:
      case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT: {
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  private static getDateOfBirth (defendant: Party): Moment {
    if (defendant.type === PartyType.INDIVIDUAL.value) {
      return MomentFactory.parse((defendant as Individual).dateOfBirth)
    }
    return undefined
  }

  private static getMonthlyDisposableIncome (claim: Claim): number {
    const repository: AllowanceRepository = new ResourceAllowanceRepository()
    const allowanceHelper = new AllowanceCalculations(repository)
    const statementOfMeansCalculations: StatementOfMeansCalculations = new StatementOfMeansCalculations(allowanceHelper)
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const disposableIncome = statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(
      response.statementOfMeans,
      response.defendant.type,
      PaymentOptionPage.getDateOfBirth(response.defendant))
    return disposableIncome === 0 ? 0 : Math.round(disposableIncome * 100) / 100
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {

    const courtDetermination: CourtDetermination = new CourtDetermination()

    locals.draft.document.courtDetermination = courtDetermination

    if (!locals.claim.claimData.defendant.isBusiness()) {
      locals.draft.document.courtDetermination.disposableIncome = PaymentOptionPage.getMonthlyDisposableIncome(locals.claim)
    } else {
      locals.draft.document.courtDetermination.disposableIncome = undefined

      if (locals.draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.IMMEDIATELY && !locals.claim.claimData.defendant.isBusiness()) {
        const decisionType: DecisionType = PaymentOptionPage.getCourtDecision(locals.draft.document, locals.claim)

        courtDetermination.decisionType = decisionType
        courtDetermination.courtPaymentIntention = PaymentOptionPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim)
        courtDetermination.courtDecision = PaymentOptionPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
      }
    }
    return super.saveDraft(locals)
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(claimantResponsePath)
