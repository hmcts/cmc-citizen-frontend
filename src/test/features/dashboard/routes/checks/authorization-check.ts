import * as config from 'config'

import { checkAuthorizationGuards as check } from '../../../../routes/authorization-check'

export const accessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login\\?response_type=code&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&client_id=cmc_citizen&redirect_uri=http://127.0.0.1:[0-9]{1,5}/oauth`)

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, accessDeniedPagePattern)
}
