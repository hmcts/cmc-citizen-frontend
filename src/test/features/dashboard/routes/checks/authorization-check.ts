import { checkAuthorizationGuards as check, AuthorizationGuardOptions } from 'test/routes/authorization-check'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string, accessDeniedPage?: string | RegExp, options?: AuthorizationGuardOptions) {
  check(app, method, pagePath, accessDeniedPage, options)
}
