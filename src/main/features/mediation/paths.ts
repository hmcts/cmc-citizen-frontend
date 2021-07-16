import { RoutablePath } from 'shared/router/routablePath'

export const mediationPath = '/case/:externalId/mediation'

export class Paths {
  static readonly freeTelephoneMediationPage = new RoutablePath(`${mediationPath}/free-telephone-mediation`)
  static readonly canWeUsePage = new RoutablePath(`${mediationPath}/can-we-use`)
  static readonly canWeUseCompanyPage = new RoutablePath(`${mediationPath}/can-we-use-company`)
  static readonly mediationDisagreementPage = new RoutablePath(`${mediationPath}/mediation-disagreement`)
  static readonly iDontWantFreeMediationPage = new RoutablePath(`${mediationPath}/i-dont-want-free-mediation`)
  static readonly mediationAgreementDocument = new RoutablePath(`${mediationPath}/agreement`)
}
