import * as express from 'express'
import * as config from 'config'
import * as fs from 'fs-extra'
import { hostname } from 'os'
import * as path from 'path'
import { RequestPromiseOptions } from 'request-promise-native'

import { InfoContributor, InfoContributorConfig, infoRequestHandler } from '@hmcts/info-provider'

/* tslint:disable:no-default-export */
export default express.Router()
  .get('/info', infoRequestHandler({
    info: {
      'claimstore': basicInfoContributor('claim-store'),
      'draft-store': basicInfoContributor('draft-store'),
      'fees': basicInfoContributor('fees'),
      'pay': basicInfoContributor('pay'),
      'idam-service-2-service-auth': basicInfoContributor('idam.service-2-service-auth'),
      'idam-api': basicInfoContributor('idam.api'),
      'idam-authentication-web': caCertRequiredLocallyInfoContributor('idam.authentication-web')
    },
    extraBuildInfo: {
      featureToggles: config.get('featureToggles'),
      hostname: hostname()
    }
  }))

function basicInfoContributor (serviceName): InfoContributor {
  return new InfoContributor(url(serviceName))
}

function caCertRequiredLocallyInfoContributor (serviceName): InfoContributor {
  const options: RequestPromiseOptions = {}
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dockertests' || !process.env.NODE_ENV) {
    const sslDirectory = path.join(__dirname, '..', 'resources', 'localhost-ssl')
    options.ca = fs.readFileSync(path.join(sslDirectory, 'localhost-ca.crt'))
  }

  return new InfoContributor(
    url(serviceName),
    new InfoContributorConfig(options)
  )
}

function url (serviceName: string): string {
  const healthCheckUrlLocation = `${serviceName}.infoContributorUrl`

  if (config.has(healthCheckUrlLocation)) {
    return config.get<string>(healthCheckUrlLocation)
  } else {
    return config.get<string>(`${serviceName}.url`) + '/info'
  }
}
