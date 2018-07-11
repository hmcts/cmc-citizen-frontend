import { RoutablePath } from 'shared/router/routablePath'

const claimantResponsePath = '/case/:externalId/claimant-response'

export class Paths {
  static readonly taskListPage = new RoutablePath(`${claimantResponsePath}/task-list`)
  static readonly defendantResponsePage = new RoutablePath(`${claimantResponsePath}/defendant-response`)
  static readonly checkAndSendPage = new RoutablePath(`${claimantResponsePath}/check-and-send`)
  static readonly confirmationPage = new RoutablePath(`${claimantResponsePath}/confirmation`)
  static readonly notImplementedYetPage = new RoutablePath(`${claimantResponsePath}/not-implemented-yet`)
}
