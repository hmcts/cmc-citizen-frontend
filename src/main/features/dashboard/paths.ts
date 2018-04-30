import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
}
