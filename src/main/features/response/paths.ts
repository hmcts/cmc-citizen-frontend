import { RoutablePath } from 'shared/router/routablePath'

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
  static readonly incompleteSubmissionPage = new RoutablePath(`${responsePath}/incomplete-submission`)
  static readonly timelinePage = new RoutablePath(`${responsePath}/timeline`)
  static readonly evidencePage = new RoutablePath(`${responsePath}/evidence`)
  static readonly receiptReceiver = new RoutablePath(`${responsePath}/receipt`)
  static readonly sendYourResponseByEmailPage = new RoutablePath(`${responsePath}/eligibility/send-your-response-by-email`)
  static readonly whenDidYouPay = new RoutablePath(`${responsePath}/when-did-you-pay`)
  static readonly defendantHowMuchPaidClaimant = new RoutablePath(`${responsePath}/eligibility/how-much-paid-claimant`)
  // Added in case anyone has a printed copy of a PDF with the old URL
  static readonly legacyDashboardRedirect = new RoutablePath('/response/dashboard')
  static readonly defendantHowMuchPaid = new RoutablePath(`${responsePath}/how-much-paid`)
  static readonly defendantHowMuchOwed = new RoutablePath(`${responsePath}/how-much-owed`)
  static readonly defenceRejectAllOfClaimPage = new RoutablePath(`${responsePath}/reject-all-of-claim`)
  static readonly defenceRejectPartOfClaimPage = new RoutablePath(`${responsePath}/reject-part-of-claim`)
  static readonly impactOfDisputePage = new RoutablePath(`${responsePath}/impact-of-dispute`)
  static readonly claimDetailsPage = new RoutablePath(`${responsePath}/claim-details`)
  static readonly summaryPage = new RoutablePath(`${responsePath}/summary`)
}

const statementOfMeansPath = `${responsePath}/statement-of-means`

export class StatementOfMeansPaths {
  static readonly startPage = new RoutablePath(`${statementOfMeansPath}/start`)
  static readonly whatYouNeedPage = new RoutablePath(`${statementOfMeansPath}/what-you-need`)
  static readonly residencePage = new RoutablePath(`${statementOfMeansPath}/residence`)
  static readonly dependantsPage = new RoutablePath(`${statementOfMeansPath}/dependants`)
  static readonly educationPage = new RoutablePath(`${statementOfMeansPath}/education`)
  static readonly maintenancePage = new RoutablePath(`${statementOfMeansPath}/maintenance`)
  static readonly supportedByYouPage = new RoutablePath(`${statementOfMeansPath}/supported-by-you`)
  static readonly employmentPage = new RoutablePath(`${statementOfMeansPath}/employment`)
  static readonly employersPage = new RoutablePath(`${statementOfMeansPath}/employers`)
  static readonly selfEmployedPage = new RoutablePath(`${statementOfMeansPath}/self-employed`)
  static readonly unemployedPage = new RoutablePath(`${statementOfMeansPath}/unemployed`)
  static readonly bankAccountsPage = new RoutablePath(`${statementOfMeansPath}/bank-accounts`)
  static readonly debtsPage = new RoutablePath(`${statementOfMeansPath}/debts`)
  static readonly monthlyIncomePage = new RoutablePath(`${statementOfMeansPath}/monthly-income`)
  static readonly monthlyExpensesPage = new RoutablePath(`${statementOfMeansPath}/monthly-expenses`)
  static readonly courtOrdersPage = new RoutablePath(`${statementOfMeansPath}/court-orders`)
  static readonly explainWhyCannotPayImmediatelyPage = new RoutablePath(`${statementOfMeansPath}/explain-why-cannot-pay-immediately`)
  static readonly brieflyExplainWhyCannotPayImmediatelyPage = new RoutablePath(`${statementOfMeansPath}/briefly-explain-why-cannot-pay-immediately`)
}

const fullAdmissionPath = `${responsePath}/full-admission`

export class FullAdmissionPaths {
  static readonly paymentOptionPage = new RoutablePath(`${fullAdmissionPath}/payment-option`)
  static readonly paymentDatePage: RoutablePath = new RoutablePath(`${fullAdmissionPath}/payment-date`)
  static readonly paymentPlanPage = new RoutablePath(`${fullAdmissionPath}/payment-plan`)
}
