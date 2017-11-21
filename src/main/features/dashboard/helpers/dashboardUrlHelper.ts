import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'

export class DashboardUrlHelper {

  static getStatusUrl (claim: Claim): string {
    if (claim.settlementReachedAt) {
      return Paths.agreementReceiver.evaluateUri({ externalId: claim.externalId })
    } else {
      return Paths.offerResponsePage.evaluateUri({ externalId: claim.externalId })
    }
  }

  static getNextResponseUrl (claim: Claim): string {
    if (claim.respondedAt || claim.countyCourtJudgmentRequestedAt) {
      return Paths.defendantPage.evaluateUri({ externalId: claim.externalId })
    } else {
      return Paths.responseTaskListPage.evaluateUri({ externalId: claim.externalId })
    }
  }
}
