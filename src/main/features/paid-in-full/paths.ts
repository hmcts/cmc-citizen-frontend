import { RoutablePath } from 'shared/router/routablePath'

export const paidInFullPath = '/case/:externalId/paid-in-full'

export class Paths {
  static readonly datePaidPage = new RoutablePath(`${paidInFullPath}/date-paid`)
  static readonly confirmationPage = new RoutablePath(`${paidInFullPath}/confirmation`)
}
