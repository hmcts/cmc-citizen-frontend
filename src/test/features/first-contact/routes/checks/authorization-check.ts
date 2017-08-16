import { checkAuthorizationGuards as check } from '../../../../routes/authorization-check'

import { ErrorPaths } from 'first-contact/paths'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, ErrorPaths.claimSummaryAccessDeniedPage.uri)
}
