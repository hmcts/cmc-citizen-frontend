import { RoutablePath } from 'common/router/routablePath'

import { Paths as AppPaths } from 'app/paths'

export class Paths {
  static readonly defendantLoginReceiver = AppPaths.receiver
  static readonly defendantLinkReceiver = new RoutablePath('/response/:letterHolderId/receiver')
  static readonly taskListPage = new RoutablePath('/response/task-list')
  static readonly defendantYourDetailsPage = new RoutablePath('/response/your-details')
  static readonly defendantDateOfBirthPage = new RoutablePath('/response/your-dob')
  static readonly defendantMobilePage = new RoutablePath('/response/your-mobile')
  static readonly moreTimeRequestPage = new RoutablePath('/response/more-time-request')
  static readonly moreTimeConfirmationPage = new RoutablePath('/response/more-time-confirmation')
  static readonly responseTypePage = new RoutablePath('/response/response-type')
  static readonly defenceOptionsPage = new RoutablePath('/response/defence-options')
  static readonly defencePage = new RoutablePath('/response/your-defence')
  static readonly freeMediationPage = new RoutablePath('/response/free-mediation')
  static readonly checkAndSendPage = new RoutablePath('/response/check-and-send')
  static readonly confirmationPage = new RoutablePath('/response/confirmation')
  static readonly counterClaimPage = new RoutablePath('/response/counter-claim')
  static readonly partialAdmissionPage = new RoutablePath('/response/partial-admission')
  static readonly fullAdmissionPage = new RoutablePath('/response/full-admission')
  static readonly receiptReceiver = new RoutablePath('/response/:externalId/receipt')
  // Added in case anyone has a printed copy of a PDF with the old URL
  static readonly legacyDashboardRedirect = new RoutablePath('/response/dashboard')
}
