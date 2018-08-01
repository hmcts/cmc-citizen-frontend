import { RoutablePath } from 'shared/router/routablePath'

import { Paths as TaskListPaths } from 'shared/components/task-list/paths'

export const claimantResponsePath = '/case/:externalId/claimant-response'

export class Paths {
  static readonly taskListPage = new RoutablePath(claimantResponsePath + TaskListPaths.taskListPage.uri)
  static readonly settleAdmittedPage = new RoutablePath(`${claimantResponsePath}/settle-admitted`)
  static readonly acceptPaymentMethodPage = new RoutablePath(`${claimantResponsePath}/accept-payment-method`)
  static readonly checkAndSendPage = new RoutablePath(`${claimantResponsePath}/check-and-send`)
  static readonly incompleteSubmissionPage = new RoutablePath(claimantResponsePath + TaskListPaths.incompleteTaskListPage.uri)
  static readonly notImplementedYetPage = new RoutablePath(`${claimantResponsePath}/not-implemented-yet`)
}
