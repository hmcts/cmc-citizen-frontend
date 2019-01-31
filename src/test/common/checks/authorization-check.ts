import { checkAuthorizationGuards as check } from 'test/routes/authorization-check'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath)
}
