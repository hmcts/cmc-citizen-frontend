import { RoutablePath } from 'common/router/routablePath'

const ccjPath = '/case/:externalId/ccj'

export class Paths {
  static readonly theirDetailsPage = new RoutablePath(`${ccjPath}/their-details`)
  static readonly paymentOptionsPage = new RoutablePath(`${ccjPath}/payment-options`)
}
