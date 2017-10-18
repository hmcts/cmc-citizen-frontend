import { checkAuthorizationGuards as check } from '../../../../routes/authorization-check'

import { Paths } from 'offer/paths'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, Paths.offerPage.uri)
}
