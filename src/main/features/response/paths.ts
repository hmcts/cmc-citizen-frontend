import { RoutablePath } from 'common/router/routablePath'

import { Paths as AppPaths } from 'app/paths'

const responsePath = '/case/:externalId/response'

export class Paths {
  static readonly defendantLoginReceiver = AppPaths.oauth
  static readonly defendantLinkReceiver = new RoutablePath(`/response/:letterHolderId/receiver`)
  static readonly taskListPage = new RoutablePath(`${responsePath}/task-list`)
  static readonly defendantYourDetailsPage = new RoutablePath(`${responsePath}/your-details`)
  static readonly defendantDateOfBirthPage = new RoutablePath(`${responsePath}/your-dob`)
  static readonly defendantMobilePage = new RoutablePath(`${responsePath}/your-mobile`)
  static readonly moreTimeRequestPage = new RoutablePath(`${responsePath}/more-time-request`)
  static readonly moreTimeConfirmationPage = new RoutablePath(`${responsePath}/more-time-confirmation`)
  static readonly responseTypePage = new RoutablePath(`${responsePath}/response-type`)
  static readonly defenceOptionsPage = new RoutablePath(`${responsePath}/defence-options`)
  static readonly defencePage = new RoutablePath(`${responsePath}/your-defence`)
  static readonly freeMediationPage = new RoutablePath(`${responsePath}/free-mediation`)
  static readonly checkAndSendPage = new RoutablePath(`${responsePath}/check-and-send`)
  static readonly confirmationPage = new RoutablePath(`${responsePath}/confirmation`)
  static readonly counterClaimPage = new RoutablePath(`${responsePath}/counter-claim`)
  static readonly partialAdmissionPage = new RoutablePath(`${responsePath}/partial-admission`)
  static readonly fullAdmissionPage = new RoutablePath(`${responsePath}/full-admission`)
  static readonly incompleteSubmissionPage = new RoutablePath(`${responsePath}/incomplete-submission`)
  static readonly receiptReceiver = new RoutablePath(`${responsePath}/receipt`)
  // Added in case anyone has a printed copy of a PDF with the old URL
  static readonly legacyDashboardRedirect = new RoutablePath('/response/dashboard')
}
