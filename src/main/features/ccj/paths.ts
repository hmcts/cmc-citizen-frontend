import { RoutablePath } from 'common/router/routablePath'

const ccjPath = '/case/:externalId/ccj'

export class Paths {
  static readonly theirDetailsPage = new RoutablePath(`${ccjPath}/their-details`)
  static readonly paidAmountPage = new RoutablePath(`${ccjPath}/paid-amount`)
  static readonly paidAmountSummaryPage = new RoutablePath(`${ccjPath}/paid-amount-summary`)

}
