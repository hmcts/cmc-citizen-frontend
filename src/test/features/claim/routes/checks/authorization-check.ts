import * as config from 'config'

import { checkAuthorizationGuards as check } from '../../../../routes/authorization-check'

export const accessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login\\?continue-url=http://127.0.0.1:[0-9]{1,5}/claim/receiver`)

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, accessDeniedPagePattern)
}
