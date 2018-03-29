import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly indexPage = new RoutablePath('/testing-support/index')
  static readonly updateResponseDeadlinePage = new RoutablePath('/testing-support/update-response-deadline')
  static readonly deleteDraftsPage = new RoutablePath('/testing-support/delete-drafts')
  static readonly createDraftPage = new RoutablePath('/testing-support/create-draft')
}
