import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly indexPage = new RoutablePath('/testing-support/index')
  static readonly updateResponseDeadlinePage = new RoutablePath('/testing-support/update-response-deadline')
  static readonly deleteDraftsPage = new RoutablePath('/testing-support/delete-drafts')
  static readonly createClaimDraftPage = new RoutablePath('/testing-support/create-claim-draft')
  static readonly updateClaimDraftPage = new RoutablePath('/testing-support/update-claim-draft')
}
