"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const paths_1 = require("shared/components/payment-intention/paths");
exports.responsePath = '/case/:externalId/response';
class Paths {
}
exports.Paths = Paths;
Paths.taskListPage = new routablePath_1.RoutablePath(`${exports.responsePath}/task-list`);
Paths.defendantYourDetailsPage = new routablePath_1.RoutablePath(`${exports.responsePath}/your-details`);
Paths.defendantDateOfBirthPage = new routablePath_1.RoutablePath(`${exports.responsePath}/your-dob`);
Paths.defendantPhonePage = new routablePath_1.RoutablePath(`${exports.responsePath}/your-phone`);
Paths.moreTimeRequestPage = new routablePath_1.RoutablePath(`${exports.responsePath}/more-time-request`);
Paths.moreTimeConfirmationPage = new routablePath_1.RoutablePath(`${exports.responsePath}/more-time-confirmation`);
Paths.responseTypePage = new routablePath_1.RoutablePath(`${exports.responsePath}/response-type`);
Paths.defencePage = new routablePath_1.RoutablePath(`${exports.responsePath}/your-defence`);
Paths.checkAndSendPage = new routablePath_1.RoutablePath(`${exports.responsePath}/check-and-send`);
Paths.confirmationPage = new routablePath_1.RoutablePath(`${exports.responsePath}/confirmation`);
Paths.counterClaimPage = new routablePath_1.RoutablePath(`${exports.responsePath}/counter-claim`);
Paths.incompleteSubmissionPage = new routablePath_1.RoutablePath(`${exports.responsePath}/incomplete-submission`);
Paths.timelinePage = new routablePath_1.RoutablePath(`${exports.responsePath}/timeline`);
Paths.evidencePage = new routablePath_1.RoutablePath(`${exports.responsePath}/evidence`);
Paths.receiptReceiver = new routablePath_1.RoutablePath(`${exports.responsePath}/receipt`);
Paths.sendYourResponseByEmailPage = new routablePath_1.RoutablePath(`${exports.responsePath}/eligibility/send-your-response-by-email`);
Paths.under18Page = new routablePath_1.RoutablePath(`${exports.responsePath}/eligibility/under-18`);
Paths.whenDidYouPay = new routablePath_1.RoutablePath(`${exports.responsePath}/when-did-you-pay`);
// Added in case anyone has a printed copy of a PDF with the old URL
Paths.legacyDashboardRedirect = new routablePath_1.RoutablePath('/response/dashboard');
Paths.defendantHowMuchOwed = new routablePath_1.RoutablePath(`${exports.responsePath}/how-much-owed`);
Paths.defenceRejectAllOfClaimPage = new routablePath_1.RoutablePath(`${exports.responsePath}/reject-all-of-claim`);
Paths.impactOfDisputePage = new routablePath_1.RoutablePath(`${exports.responsePath}/impact-of-dispute`);
Paths.claimDetailsPage = new routablePath_1.RoutablePath(`${exports.responsePath}/claim-details`);
Paths.summaryPage = new routablePath_1.RoutablePath(`${exports.responsePath}/summary`);
Paths.sendCompanyFinancialDetailsPage = new routablePath_1.RoutablePath(`${exports.responsePath}/send-company-financial-details`);
const statementOfMeansPath = `${exports.responsePath}/statement-of-means`;
class StatementOfMeansPaths {
}
exports.StatementOfMeansPaths = StatementOfMeansPaths;
StatementOfMeansPaths.introPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/intro`);
StatementOfMeansPaths.bankAccountsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/bank-accounts`);
StatementOfMeansPaths.residencePage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/residence`);
StatementOfMeansPaths.dependantsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/dependants`);
StatementOfMeansPaths.educationPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/dependants/education`);
StatementOfMeansPaths.otherDependantsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/other-dependants`);
StatementOfMeansPaths.employmentPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/employment`);
StatementOfMeansPaths.employersPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/employment/employers`);
StatementOfMeansPaths.selfEmploymentPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/employment/self-employment`);
StatementOfMeansPaths.onTaxPaymentsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/employment/self-employment/on-tax-payments`);
StatementOfMeansPaths.unemployedPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/unemployment`);
StatementOfMeansPaths.monthlyIncomePage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/monthly-income`);
StatementOfMeansPaths.monthlyExpensesPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/monthly-expenses`);
StatementOfMeansPaths.debtsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/debts`);
StatementOfMeansPaths.courtOrdersPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/court-orders`);
StatementOfMeansPaths.explanationPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/explanation`);
StatementOfMeansPaths.priorityDebtsPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/priority-debts`);
StatementOfMeansPaths.disabilityPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/disability`);
StatementOfMeansPaths.severeDisabilityPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/severe-disability`);
StatementOfMeansPaths.partnerPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/partner/partner`);
StatementOfMeansPaths.partnerAgePage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/partner/partner-age`);
StatementOfMeansPaths.partnerPensionPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/partner/partner-pension`);
StatementOfMeansPaths.partnerDisabilityPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/partner/partner-disability`);
StatementOfMeansPaths.partnerSevereDisabilityPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/partner/partner-severe-disability`);
StatementOfMeansPaths.dependantsDisabilityPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/dependants/disability`);
StatementOfMeansPaths.carerPage = new routablePath_1.RoutablePath(`${statementOfMeansPath}/carer`);
exports.fullAdmissionPath = `${exports.responsePath}/full-admission`;
class FullAdmissionPaths {
}
exports.FullAdmissionPaths = FullAdmissionPaths;
FullAdmissionPaths.paymentOptionPage = new routablePath_1.RoutablePath(exports.fullAdmissionPath + paths_1.Paths.paymentOptionPage.uri);
FullAdmissionPaths.paymentDatePage = new routablePath_1.RoutablePath(exports.fullAdmissionPath + paths_1.Paths.paymentDatePage.uri);
FullAdmissionPaths.paymentPlanPage = new routablePath_1.RoutablePath(`${exports.fullAdmissionPath}/payment-plan`);
exports.partialAdmissionPath = `${exports.responsePath}/partial-admission`;
class PartAdmissionPaths {
}
exports.PartAdmissionPaths = PartAdmissionPaths;
PartAdmissionPaths.alreadyPaidPage = new routablePath_1.RoutablePath(`${exports.partialAdmissionPath}/already-paid`);
PartAdmissionPaths.howMuchHaveYouPaidPage = new routablePath_1.RoutablePath(`${exports.partialAdmissionPath}/how-much-have-you-paid`);
PartAdmissionPaths.howMuchDoYouOwePage = new routablePath_1.RoutablePath(`${exports.partialAdmissionPath}/how-much-do-you-owe`);
PartAdmissionPaths.whyDoYouDisagreePage = new routablePath_1.RoutablePath(`${exports.partialAdmissionPath}/why-do-you-disagree`);
PartAdmissionPaths.paymentOptionPage = new routablePath_1.RoutablePath(exports.partialAdmissionPath + paths_1.Paths.paymentOptionPage.uri);
PartAdmissionPaths.paymentDatePage = new routablePath_1.RoutablePath(exports.partialAdmissionPath + paths_1.Paths.paymentDatePage.uri);
PartAdmissionPaths.paymentPlanPage = new routablePath_1.RoutablePath(`${exports.partialAdmissionPath}/payment-plan`);
exports.fullRejectionPath = `${exports.responsePath}/full-rejection`;
class FullRejectionPaths {
}
exports.FullRejectionPaths = FullRejectionPaths;
FullRejectionPaths.howMuchHaveYouPaidPage = new routablePath_1.RoutablePath(`${exports.fullRejectionPath}/how-much-have-you-paid`);
FullRejectionPaths.youHavePaidLessPage = new routablePath_1.RoutablePath(`${exports.fullRejectionPath}/you-have-paid-less`);
FullRejectionPaths.whyDoYouDisagreePage = new routablePath_1.RoutablePath(`${exports.fullRejectionPath}/why-do-you-disagree`);
