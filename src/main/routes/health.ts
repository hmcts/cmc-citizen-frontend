import * as express from 'express'
import * as config from 'config'
import * as healthcheck from '@hmcts/nodejs-healthcheck'
import * as fs from 'fs'
import * as path from 'path'

export default express.Router()
  .get('/health', healthcheck.configure({
    checks: {
      'claimstore': basicHealthCheck('claim-store'),
      'draft-store': basicHealthCheck('draft-store'),
      'fees': basicHealthCheck('fees'),
      'pdf-service': basicHealthCheck('pdf-service'),
      'pay': basicHealthCheck('pay'),
      'idam-service-2-service-auth': basicHealthCheck('idam.service-2-service-auth'),
      'idam-api': basicHealthCheck('idam.api'),
      'idam-authentication-web': basicHealthCheck('idam.authentication-web')
    }
  }))

function basicHealthCheck (serviceName) {
  const options = {}
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    const sslDirectory = path.join(__dirname, '..', 'resources', 'localhost-ssl')
    options['ca'] = fs.readFileSync(path.join(sslDirectory, 'localhost-ca.crt'))
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
