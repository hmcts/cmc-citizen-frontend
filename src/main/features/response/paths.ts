import { RoutablePath } from 'common/router/routablePath'

const responsePath = '/case/:externalId/response'

export class Paths {
  static readonly taskListPage = new RoutablePath(`${responsePath}/task-list`)
  static readonly defendantYourDetailsPage = new RoutablePath(`${responsePath}/your-details`)
  static readonly defendantDateOfBirthPage = new RoutablePath(`${responsePath}/your-dob`)
  static readonly defendantMobilePage = new RoutablePath(`${responsePath}/your-mobile`)
  static readonly moreTimeRequestPage = new RoutablePath(`${responsePath}/more-time-request`)
  static readonly moreTimeConfirmationPage = new RoutablePath(`${responsePath}/more-time-confirmation`)
  static readonly responseTypePage = new RoutablePath(`${responsePath}/response-type`)
  static readonly defencePage = new RoutablePath(`${responsePath}/your-defence`)

  static readonly freeMediationPage = new RoutablePath(`${responsePath}/free-mediation`)
  static readonly checkAndSendPage = new RoutablePath(`${responsePath}/check-and-send`)
  static readonly confirmationPage = new RoutablePath(`${responsePath}/confirmation`)
  static readonly counterClaimPage = new RoutablePath(`${responsePath}/counter-claim`)
  static readonly partialAdmissionPage = new RoutablePath(`${responsePath}/partial-admission`)
  static readonly fullAdmissionPage = new RoutablePath(`${responsePath}/full-admission`)
  static readonly incompleteSubmissionPage = new RoutablePath(`${responsePath}/incomplete-submission`)
  static readonly timelinePage = new RoutablePath(`${responsePath}/timeline`)
  static readonly evidencePage = new RoutablePath(`${responsePath}/evidence`)
  static readonly receiptReceiver = new RoutablePath(`${responsePath}/receipt`)
  // Added in case anyone has a printed copy of a PDF with the old URL
  static readonly legacyDashboardRedirect = new RoutablePath('/response/dashboard')
  static readonly defendantHowMuchPaid = new RoutablePath(`${responsePath}/how-much-paid`)
  static readonly defendantHowMuchOwed = new RoutablePath(`${responsePath}/how-much-owed`)
  static readonly defenceRejectAllOfClaimPage = new RoutablePath(`${responsePath}/reject-all-of-claim`)
  static readonly defenceRejectPartOfClaimPage = new RoutablePath(`${responsePath}/reject-part-of-claim`)
  static readonly impactOfDisputePage = new RoutablePath(`${responsePath}/impact-of-dispute`)
}

const statementOfMeansPath = `${responsePath}/statement-of-means`

export class StatementOfMeansPaths {
  static readonly startPage = new RoutablePath(`${statementOfMeansPath}/start`)
  static readonly whatYouNeedPage = new RoutablePath(`${statementOfMeansPath}/what-you-need`)
  static readonly residencePage = new RoutablePath(`${statementOfMeansPath}/residence`)
  static readonly employmentPage = new RoutablePath(`${statementOfMeansPath}/employment`)
}
