import { RoutablePath } from 'common/router/routablePath'

const offerPath = '/case/:externalId/offer'

export class Paths {
  static readonly offerPage = new RoutablePath(`${offerPath}/your-offer`)
  static readonly offerConfirmationPage = new RoutablePath(`${offerPath}/offer-confirmation`)
  static readonly settleOutOfCourtPage = new RoutablePath(`${offerPath}/settle-out-of-court`)
  static readonly responsePage = new RoutablePath(`${offerPath}/response`)
  static readonly makeAgreementPage = new RoutablePath(`${offerPath}/make-agreement`)
  static readonly declarationPage = new RoutablePath(`${offerPath}/declaration`)
  static readonly acceptedPage = new RoutablePath(`${offerPath}/accepted`)
  static readonly rejectedPage = new RoutablePath(`${offerPath}/rejected`)
}
