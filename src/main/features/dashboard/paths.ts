import { RoutablePath } from 'shared/router/routablePath'
import { paidInFullPath } from 'paid-in-full/paths'
import * as config from 'config'

const cuiUrl: string = `${config.get<string>('cui.url')}`

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
  static readonly directionsQuestionnairePage = new RoutablePath('/dashboard/:externalId/directions-questionnaire')
  static readonly contactThemPage = new RoutablePath('/dashboard/:externalId/contact-them')
  static readonly datePaidPage = new RoutablePath(`${paidInFullPath}/date-paid`)
  static readonly baseCuiUrl = cuiUrl
}
