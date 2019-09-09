import { RoutablePath } from 'shared/router/routablePath'

const ordersPath = '/case/:externalId/orders'

export class Paths {
  static readonly disagreeReasonPage = new RoutablePath(`${ordersPath}/disagree-with-order`)
  static readonly confirmationPage = new RoutablePath(`${ordersPath}/confirmation`)
  static readonly reviewOrderReceiver = new RoutablePath(`${ordersPath}/review-order-receipt`)
  static readonly directionsOrderDocument = new RoutablePath(`${ordersPath}/receipt`)
}
