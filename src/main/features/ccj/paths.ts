import { RoutablePath } from 'common/router/routablePath'

const ccjPath = '/case/:externalId/ccj'

export class Paths {
  static readonly theirDetailsPage = new RoutablePath(`${ccjPath}/their-details`)
  static readonly claimAmountPage = new RoutablePath(`${ccjPath}/claim-amount`)
  static readonly claimAmountSummaryPage = new RoutablePath(`${ccjPath}/claim-amount-summary`)

}
