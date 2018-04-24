import { Claim } from 'claims/models/claim'

import { Paths } from 'dashboard/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as OfferPaths } from 'offer/paths'

export class DashboardUrlHelper {

  static getStatusUrl (claim: Claim): string {
    if (claim.settlementReachedAt) {
      return OfferPaths.agreementReceiver.evaluateUri({ externalId: claim.externalId })
    } else if (!claim.respondedAt) {
      return ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId })
    } else {
      return OfferPaths.responsePage.evaluateUri({ externalId: claim.externalId })
    }
  }

  static getNextResponseUrl (claim: Claim): string {
    if (claim.respondedAt || claim.countyCourtJudgmentRequestedAt) {
      return Paths.defendantPage.evaluateUri({ externalId: claim.externalId })
    } else {
      return ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId })
    }
  }
}
