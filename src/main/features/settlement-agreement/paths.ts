import { RoutablePath } from 'shared/router/routablePath'

const settlementAgreementPath = '/case/:externalId/settlement-agreement'

export class Paths {
  static readonly signSettlementAgreement = new RoutablePath(`${settlementAgreementPath}/sign-settlement-agreement`)
  static readonly settlementAgreementConfirmation = new RoutablePath(`${settlementAgreementPath}/settlement-agreement-confirmation`)
  static readonly repaymentPlanSummary = new RoutablePath(`${settlementAgreementPath}/repayment-plan-summary`)
}
