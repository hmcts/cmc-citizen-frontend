import { RoutablePath } from 'shared/router/routablePath'

export const directionsQuestionnairePath = '/case/:externalId/directions-questionnaire'

export class Paths {
  static readonly hearingLocationPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-location`)
}
