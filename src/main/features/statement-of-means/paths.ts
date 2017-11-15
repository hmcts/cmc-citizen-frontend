import { RoutablePath } from 'common/router/routablePath'

const statementOfMeansPath: string = '/case/:externalId/statement-of-means'

export class Paths {
  static readonly employmentPage = new RoutablePath(`${statementOfMeansPath}/employment`)
}
