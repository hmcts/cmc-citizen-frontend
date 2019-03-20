import { RoutablePath } from 'shared/router/routablePath'

export const directionsQuestionnairePath = '/case/:externalId/directions-questionnaire'

export class Paths {
  static readonly hearingLocationPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-location`)
  static readonly selfWitnessPage = new RoutablePath(`${directionsQuestionnairePath}/self-witness`)
  static readonly otherWitnessesPage = new RoutablePath(`${directionsQuestionnairePath}/other-witnesses`)
  static readonly hearingDatesPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-dates`)
  static readonly hearingExceptionalCircumstancesPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-exceptional-circumstances`)
  static readonly expertPage = new RoutablePath(`${directionsQuestionnairePath}/expert`)
  static readonly hearingDatesPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-dates`)

  static readonly hearingDatesUpdateReceiver = new RoutablePath(`${Paths.hearingDatesPage.uri}/date-picker/:method`)
}
