import { RoutablePath } from 'shared/router/routablePath'

export const directionsQuestionnairePath = '/case/:externalId/directions-questionnaire'

export class Paths {
  static readonly hearingLocationPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-location`)
  static readonly selfWitnessPage = new RoutablePath(`${directionsQuestionnairePath}/self-witness`)
  static readonly otherWitnessesPage = new RoutablePath(`${directionsQuestionnairePath}/other-witnesses`)
  static readonly hearingDatesPage = new RoutablePath(`${directionsQuestionnairePath}/dates`)
}
