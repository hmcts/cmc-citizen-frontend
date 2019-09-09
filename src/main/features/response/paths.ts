import { RoutablePath } from 'shared/router/routablePath'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'

export const responsePath = '/case/:externalId/response'

export class Paths {
  static readonly taskListPage = new RoutablePath(`${responsePath}/task-list`)
  static readonly defendantYourDetailsPage = new RoutablePath(`${responsePath}/your-details`)
  static readonly defendantDateOfBirthPage = new RoutablePath(`${responsePath}/your-dob`)
  static readonly defendantPhonePage = new RoutablePath(`${responsePath}/your-phone`)
  static readonly moreTimeRequestPage = new RoutablePath(`${responsePath}/more-time-request`)
  static readonly moreTimeConfirmationPage = new RoutablePath(`${responsePath}/more-time-confirmation`)
  static readonly responseTypePage = new RoutablePath(`${responsePath}/response-type`)
  static readonly defencePage = new RoutablePath(`${responsePath}/your-defence`)
  static readonly checkAndSendPage = new RoutablePath(`${responsePath}/check-and-send`)
  static readonly confirmationPage = new RoutablePath(`${responsePath}/confirmation`)
  static readonly counterClaimPage = new RoutablePath(`${responsePath}/counter-claim`)
  static readonly incompleteSubmissionPage = new RoutablePath(`${responsePath}/incomplete-submission`)
  static readonly timelinePage = new RoutablePath(`${responsePath}/timeline`)
  static readonly evidencePage = new RoutablePath(`${responsePath}/evidence`)
  static readonly receiptReceiver = new RoutablePath(`${responsePath}/receipt`)
  static readonly sendYourResponseByEmailPage = new RoutablePath(`${responsePath}/eligibility/send-your-response-by-email`)
  static readonly under18Page = new RoutablePath(`${responsePath}/eligibility/under-18`)
  static readonly whenDidYouPay = new RoutablePath(`${responsePath}/when-did-you-pay`)
  // Added in case anyone has a printed copy of a PDF with the old URL
  static readonly legacyDashboardRedirect = new RoutablePath('/response/dashboard')
  static readonly defendantHowMuchOwed = new RoutablePath(`${responsePath}/how-much-owed`)
  static readonly defenceRejectAllOfClaimPage = new RoutablePath(`${responsePath}/reject-all-of-claim`)
  static readonly impactOfDisputePage = new RoutablePath(`${responsePath}/impact-of-dispute`)
  static readonly claimDetailsPage = new RoutablePath(`${responsePath}/claim-details`)
  static readonly summaryPage = new RoutablePath(`${responsePath}/summary`)
  static readonly sendCompanyFinancialDetailsPage = new RoutablePath(`${responsePath}/send-company-financial-details`)
}

const statementOfMeansPath = `${responsePath}/statement-of-means`

export class StatementOfMeansPaths {
  static readonly introPage = new RoutablePath(`${statementOfMeansPath}/intro`)
  static readonly bankAccountsPage = new RoutablePath(`${statementOfMeansPath}/bank-accounts`)
  static readonly residencePage = new RoutablePath(`${statementOfMeansPath}/residence`)
  static readonly dependantsPage = new RoutablePath(`${statementOfMeansPath}/dependants`)
  static readonly educationPage = new RoutablePath(`${statementOfMeansPath}/dependants/education`)
  static readonly otherDependantsPage = new RoutablePath(`${statementOfMeansPath}/other-dependants`)
  static readonly employmentPage = new RoutablePath(`${statementOfMeansPath}/employment`)
  static readonly employersPage = new RoutablePath(`${statementOfMeansPath}/employment/employers`)
  static readonly selfEmploymentPage = new RoutablePath(`${statementOfMeansPath}/employment/self-employment`)
  static readonly onTaxPaymentsPage = new RoutablePath(`${statementOfMeansPath}/employment/self-employment/on-tax-payments`)
  static readonly unemployedPage = new RoutablePath(`${statementOfMeansPath}/unemployment`)
  static readonly monthlyIncomePage = new RoutablePath(`${statementOfMeansPath}/monthly-income`)
  static readonly monthlyExpensesPage = new RoutablePath(`${statementOfMeansPath}/monthly-expenses`)
  static readonly debtsPage = new RoutablePath(`${statementOfMeansPath}/debts`)
  static readonly courtOrdersPage = new RoutablePath(`${statementOfMeansPath}/court-orders`)
  static readonly explanationPage = new RoutablePath(`${statementOfMeansPath}/explanation`)
  static readonly priorityDebtsPage = new RoutablePath(`${statementOfMeansPath}/priority-debts`)
  static readonly disabilityPage = new RoutablePath(`${statementOfMeansPath}/disability`)
  static readonly severeDisabilityPage = new RoutablePath(`${statementOfMeansPath}/severe-disability`)
  static readonly partnerPage = new RoutablePath(`${statementOfMeansPath}/partner/partner`)
  static readonly partnerAgePage = new RoutablePath(`${statementOfMeansPath}/partner/partner-age`)
  static readonly partnerPensionPage = new RoutablePath(`${statementOfMeansPath}/partner/partner-pension`)
  static readonly partnerDisabilityPage = new RoutablePath(`${statementOfMeansPath}/partner/partner-disability`)
  static readonly partnerSevereDisabilityPage = new RoutablePath(`${statementOfMeansPath}/partner/partner-severe-disability`)
  static readonly dependantsDisabilityPage = new RoutablePath(`${statementOfMeansPath}/dependants/disability`)
  static readonly carerPage = new RoutablePath(`${statementOfMeansPath}/carer`)
}

export const fullAdmissionPath = `${responsePath}/full-admission`

export class FullAdmissionPaths {
  static readonly paymentOptionPage = new RoutablePath(fullAdmissionPath + PaymentIntentionPaths.paymentOptionPage.uri)
  static readonly paymentDatePage = new RoutablePath(fullAdmissionPath + PaymentIntentionPaths.paymentDatePage.uri)
  static readonly paymentPlanPage = new RoutablePath(`${fullAdmissionPath}/payment-plan`)
}

export const partialAdmissionPath = `${responsePath}/partial-admission`

export class PartAdmissionPaths {
  static readonly alreadyPaidPage = new RoutablePath(`${partialAdmissionPath}/already-paid`)
  static readonly howMuchHaveYouPaidPage = new RoutablePath(`${partialAdmissionPath}/how-much-have-you-paid`)
  static readonly howMuchDoYouOwePage = new RoutablePath(`${partialAdmissionPath}/how-much-do-you-owe`)
  static readonly whyDoYouDisagreePage = new RoutablePath(`${partialAdmissionPath}/why-do-you-disagree`)
  static readonly paymentOptionPage = new RoutablePath(partialAdmissionPath + PaymentIntentionPaths.paymentOptionPage.uri)
  static readonly paymentDatePage: RoutablePath = new RoutablePath(partialAdmissionPath + PaymentIntentionPaths.paymentDatePage.uri)
  static readonly paymentPlanPage = new RoutablePath(`${partialAdmissionPath}/payment-plan`)
}

export const fullRejectionPath = `${responsePath}/full-rejection`

export class FullRejectionPaths {
  static readonly howMuchHaveYouPaidPage = new RoutablePath(`${fullRejectionPath}/how-much-have-you-paid`)
  static readonly youHavePaidLessPage = new RoutablePath(`${fullRejectionPath}/you-have-paid-less`)
  static readonly whyDoYouDisagreePage = new RoutablePath(`${fullRejectionPath}/why-do-you-disagree`)
}
