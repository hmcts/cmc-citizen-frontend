import { checkAuthorizationGuards as check } from 'test/routes/authorization-check'

import { Paths } from 'first-contact/paths'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, Paths.startPage.uri)
}
