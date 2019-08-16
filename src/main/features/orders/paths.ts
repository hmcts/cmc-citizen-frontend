import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly disagreeReasonPage = new RoutablePath(`/case/:externalId/orders/disagree-with-order`)
  static readonly directionsOrderDocument = new RoutablePath(`/case/:externalId/orders/receipt`)
}
