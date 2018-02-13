import { RoutablePath } from 'common/router/routablePath'

import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as OfferPaths } from 'offer/paths'

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
  static readonly claimStartPage = ClaimPaths.startPage
  static readonly claimTaskListPage = ClaimPaths.taskListPage
  static readonly responseTaskListPage = ResponsePaths.taskListPage
  static readonly claimReceiptReceiver = ClaimPaths.receiptReceiver
  static readonly responseReceiptReceiver = ResponsePaths.receiptReceiver
  static readonly agreementReceiver = OfferPaths.agreementReceiver
  static readonly offerResponsePage = OfferPaths.responsePage
}
