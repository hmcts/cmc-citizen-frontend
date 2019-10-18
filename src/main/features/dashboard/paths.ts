import { RoutablePath } from 'shared/router/routablePath'
import { paidInFullPath } from 'paid-in-full/paths'

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly howFreeMediationWorksPage = new RoutablePath(`/dashboard/how-free-mediation-works`)
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
  static readonly directionsQuestionnairePage = new RoutablePath('/dashboard/:externalId/directions-questionnaire')
  static readonly contactThemPage = new RoutablePath('/dashboard/:externalId/contact-them')
  static readonly datePaidPage = new RoutablePath(`${paidInFullPath}/date-paid`)
}
