import { RoutablePath } from 'shared/router/routablePath'

export const directionsQuestionnairePath = '/case/:externalId/directions-questionnaire'

export class Paths {
  static readonly hearingLocationPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-location`)
  static readonly selfWitnessPage = new RoutablePath(`${directionsQuestionnairePath}/self-witness`)
  static readonly otherWitnessesPage = new RoutablePath(`${directionsQuestionnairePath}/other-witnesses`)
  static readonly supportPage = new RoutablePath(`${directionsQuestionnairePath}/support-required`)
  static readonly hearingExceptionalCircumstancesPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-exceptional-circumstances`)
  static readonly expertPage = new RoutablePath(`${directionsQuestionnairePath}/expert`)
  static readonly expertEvidencePage = new RoutablePath(`${directionsQuestionnairePath}/expert-evidence`)
  static readonly whyExpertIsNeededPage = new RoutablePath(`${directionsQuestionnairePath}/why-expert-is-needed`)
  static readonly hearingDatesPage = new RoutablePath(`${directionsQuestionnairePath}/hearing-dates`)
  static readonly expertReportsPage = new RoutablePath(`${directionsQuestionnairePath}/expert-reports`)
  static readonly expertGuidancePage = new RoutablePath(`${directionsQuestionnairePath}/expert-guidance`)
  static readonly permissionForExpertPage = new RoutablePath(`${directionsQuestionnairePath}/permission-for-expert`)

  static readonly hearingDatesReplaceReceiver = new RoutablePath(`${Paths.hearingDatesPage.uri}/date-picker/replace`)
  // :index should actually be of the form 'date-N' where N is the numeric index,
  // because RoutablePath will not accept purely numeric values for parameters
  static readonly hearingDatesDeleteReceiver = new RoutablePath(`${Paths.hearingDatesPage.uri}/date-picker/delete/:index`)
}
