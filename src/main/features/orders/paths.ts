import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly disagreeReasonPage = new RoutablePath(`/case/:externalId/orders/disagree-with-order`)
  static readonly confirmationPage = new RoutablePath(`/case/:externalId/orders/confirmation`)
}
