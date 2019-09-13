import { RoutablePath } from 'shared/router/routablePath'

export const mediationPath = '/case/:externalId/mediation'

export class Paths {
  static readonly howMediationWorksPage = new RoutablePath(`${mediationPath}/how-mediation-works`)
  static readonly mediationAgreementPage = new RoutablePath(`${mediationPath}/mediation-agreement`)
  static readonly willYouTryMediation = new RoutablePath(`${mediationPath}/will-you-try-mediation`)
  static readonly canWeUsePage = new RoutablePath(`${mediationPath}/can-we-use`)
  static readonly canWeUseCompanyPage = new RoutablePath(`${mediationPath}/can-we-use-company`)
  static readonly freeMediationPage = new RoutablePath(`${mediationPath}/free-mediation`)
  static readonly continueWithoutMediationPage = new RoutablePath(`${mediationPath}/continue-without-mediation`)
  static readonly mediationDisagreementPage = new RoutablePath(`${mediationPath}/mediation-disagreement`)
  static readonly tryFreeMediationPage = new RoutablePath(`${mediationPath}/try-free-mediation`)

}
