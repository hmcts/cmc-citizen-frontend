import { checkAuthorizationGuards as check } from 'test/common/checks/authorization-check'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath)
}
