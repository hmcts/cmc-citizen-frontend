import { RoutablePath } from 'shared/router/routablePath'

export const mediationPath = '/case/:externalId/mediation'

export class Paths {
  static readonly howMediationWorksPage = new RoutablePath(`${mediationPath}/how-mediation-works`)
  static readonly canWeUsePage = new RoutablePath(`${mediationPath}/can-we-use`)
}
