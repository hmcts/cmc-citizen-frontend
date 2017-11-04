import { RoutablePath } from 'common/router/routablePath'

const offerPath = '/case/:externalId/offer'

export class Paths {
  static readonly offerPage = new RoutablePath(`${offerPath}/your-offer`)
  static readonly offerConfirmationPage = new RoutablePath(`${offerPath}/offer-confirmation`)
  static readonly settleOutOfCourtPage = new RoutablePath(`${offerPath}/settle-out-of-court`)
  static readonly responsePage = new RoutablePath(`${offerPath}/response`)
}
