import { checkAuthorizationGuards as check } from '../../../../routes/authorization-check'

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath)
}
