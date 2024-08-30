import * as config from 'config'

import { RoutablePath } from 'shared/router/routablePath'
import { paidInFullPath } from 'paid-in-full/paths'

const baseCivilCitizenUrl = config.get('civil-citizen-ui.url')
const redirectToCivil = config.get('civil-citizen-ui.dashboard-redirect')

export class Paths {
  static readonly dashboardPage = new RoutablePath('/dashboard/index')
  static readonly claimantPage = new RoutablePath('/dashboard/:externalId/claimant')
  static readonly defendantPage = new RoutablePath('/dashboard/:externalId/defendant')
  static readonly directionsQuestionnairePage = new RoutablePath('/dashboard/:externalId/directions-questionnaire')
  static readonly contactThemPage = new RoutablePath('/dashboard/:externalId/contact-them')
  static readonly datePaidPage = new RoutablePath(`${paidInFullPath}/date-paid`)
}

export const dashboardUrl = redirectToCivil ? `${baseCivilCitizenUrl}/dashboard` : Paths.dashboardPage.uri
