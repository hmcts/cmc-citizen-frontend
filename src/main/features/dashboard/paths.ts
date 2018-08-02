import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
  static readonly directionsQuestionnairePage = new RoutablePath('/dashboard/:externalId/directions-questionnaire')
}
