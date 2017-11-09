import { RoutablePath } from 'common/router/routablePath'

const statementOfMeansPath = '/case/:externalId/statement-of-means'

export class Paths {
  static readonly startPage = new RoutablePath(`${statementOfMeansPath}/start`)
  static readonly whatYouNeedPage = new RoutablePath(`${statementOfMeansPath}/what-you-need`)
}
