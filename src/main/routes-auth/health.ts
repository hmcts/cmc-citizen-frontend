import * as express from 'express'
import * as config from 'config'
import * as healthcheck from '@hmcts/nodejs-healthcheck'
import * as fs from 'fs'
import * as path from 'path'
import { FeatureToggles } from 'utils/featureToggles'

import { Logger } from '@hmcts/nodejs-logging'
const logger = Logger.getLogger('health.ts')

/* tslint:disable:no-default-export */

let healthCheckRouter = express.Router()

let healthCheckConfig = {
  checks: {
    // 'claimstore': basicHealthCheck('claim-store'),
    'draft-store': basicHealthCheck('draft-store')
    // 'fees': basicHealthCheck('fees'),
    // 'pay': basicHealthCheck('pay'),
    // 'idam-service-2-service-auth': basicHealthCheck('idam.service-2-service-auth'),
    // 'idam-api': basicHealthCheck('idam.api')
  }
}

export default express.Router().use(healthCheckRouter)
try {
  // logger.info(healthCheckConfig.checks.claimstore.url)
  logger.info(healthCheckConfig.checks['draft-store'].url)
  // logger.info(healthCheckConfig.checks.fees.url)
  // logger.info(healthCheckConfig.checks.pay.url)
  // logger.info(healthCheckConfig.checks['idam-api'].url)
  // logger.info(healthCheckConfig.checks['idam-service-2-service-auth'].url)
  healthcheck.addTo(healthCheckRouter, healthCheckConfig)
  logger.info('health route added')
} catch (err) {
  logger.error(err.stack)
}

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
  logger.info(serviceName + ': ' + healthcheck.status(serviceName).status)
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
