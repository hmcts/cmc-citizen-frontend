import Envelope = require('applicationinsights/out/Declarations/Contracts/Generated/Envelope')
import { LoggerInstance } from 'winston'

const fileRegexp = new RegExp('(\\..{2,5}$)')
const uuidRegexp = new RegExp('[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}')

function hideUuidInUrlIfNotStaticFile (url: string): string {
  return fileRegexp.test(url) ? url : url.replace(uuidRegexp, '{uuid}')
}

export function operationNameUUIDHider (): (envelope: Envelope, contextObjects?: any) => boolean {

  return (envelope) => {
    // hide UUID's in operationName URL's that are not static files, so they can be aggregated properly
    if (envelope.tags && envelope.tags['ai.operation.name']) {
      envelope.tags['ai.operation.name'] = hideUuidInUrlIfNotStaticFile(envelope.tags['ai.operation.name'])
    }

    // always send
    return true
  }
}

export function errorLogger (logger: LoggerInstance): (envelope: Envelope, contextObjects?: any) => boolean {
  return (envelope) => {
    if (envelope.data && envelope.data['baseData']
          && envelope.data['baseData'].properties.error
          && envelope.data['baseData'].name === 'CMC Dashboard Failure') {
      logger.info(`AppInsights error: ${JSON.stringify({
        name: envelope.data['baseData'].name,
        error: envelope.data['baseData'].properties.error
      })}`)
    }
    return true
  }
}
