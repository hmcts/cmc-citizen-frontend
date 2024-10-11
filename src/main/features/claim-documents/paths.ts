import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly receiptReceiver = new RoutablePath('/claim/:externalId/receipt')
  static readonly sealedClaimPdfReceiver = new RoutablePath('/claim/:externalId/sealed-claim')
  static readonly documentPage = new RoutablePath('/claim/:externalId/document/:documentURI')
}
