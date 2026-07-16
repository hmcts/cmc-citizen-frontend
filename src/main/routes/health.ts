import * as express from 'express'
import * as config from 'config'
import * as healthcheck from '@hmcts/nodejs-healthcheck'
import * as fs from 'fs'
import * as path from 'path'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

/* tslint:disable:no-default-export */

let healthCheckRouter = express.Router()

// DTSCCI-5286 (HMCTS Access migration): gate the new HMCTS Access sign-in probe behind the
// 'hmcts-access-migration' LaunchDarkly flag so it only runs where HMCTS Access is live (non-prod
// during the migration). When the flag is off (e.g. production until cutover) report UP so pods
// stay healthy and deployments are not blocked before cutover.
const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
const hmctsAccessProbe = basicHealthCheck('idam.hmcts-access')

// Exported for unit testing. Runs the HMCTS Access probe only when the flag is on;
// otherwise reports UP so pods stay healthy (e.g. production until cutover).
export async function hmctsAccessHealthCheck (toggles: FeatureToggles = featureToggles, probe = hmctsAccessProbe) {
  return (await toggles.isHmctsAccessMigrationEnabled())
    ? probe.call()
    : healthcheck.up()
}

export const hmctsAccessCheck = healthcheck.raw(() => hmctsAccessHealthCheck())

let healthCheckConfig = {
  checks: {
    'claimstore': basicHealthCheck('claim-store'),
    'draft-store': basicHealthCheck('draft-store'),
    'fees': basicHealthCheck('fees'),
    'pay': basicHealthCheck('pay'),
    'idam-service-2-service-auth': basicHealthCheck('idam.service-2-service-auth'),
    'idam-api': basicHealthCheck('idam.api'),
    // DTSCCI-5286 (HMCTS Access migration): probe the new HMCTS Access front door, gated behind the
    // 'hmcts-access-migration' LaunchDarkly flag (see hmctsAccessCheck above).
    // basicHealthCheck hits ${idam.hmcts-access.url}/health (or idam.hmcts-access.healthCheckUrl if set).
    // TODO(DTSCCI-5286): confirm the HMCTS Access health path in a lower env; if it is not '/health',
    // add "healthCheckUrl" under idam.hmcts-access in config instead of relying on the '/health' suffix.
    'hmcts-access': hmctsAccessCheck
  }
}

export default express.Router().use(healthCheckRouter)
healthcheck.addTo(healthCheckRouter, healthCheckConfig)

function basicHealthCheck (serviceName) {
  const options = {
    timeout: 5000,
    deadline: 15000
  }
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dockertests' || !process.env.NODE_ENV) {
    const sslDirectory = path.join(__dirname, '..', 'resources', 'localhost-ssl')
    options['ca'] = fs.readFileSync(path.join(sslDirectory, 'localhost-ca.crt'))
  }
  if (serviceName === 'pay' && FeatureToggles.isEnabled('mockPay')) {
    return healthcheck.raw(() => { return healthcheck.up() })
  }
  return healthcheck.web(url(serviceName), options)
}

function url (serviceName: string): string {
  const healthCheckUrlLocation = `${serviceName}.healthCheckUrl`

  if (config.has(healthCheckUrlLocation)) {
    return config.get<string>(healthCheckUrlLocation)
  } else {
    return config.get<string>(`${serviceName}.url`) + '/health'
  }
}
