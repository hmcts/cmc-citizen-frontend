import * as config from 'config'
import * as appInsights from 'applicationinsights'
import * as telemetryProcessors from './telemetryProcessors'
import { LoggerInstance } from 'winston'
import { Logger } from '@hmcts/nodejs-logging'

const logger: LoggerInstance = Logger.getLogger('customEventTracker')

export class AppInsights {
  static enable () {

    const aiInstrumentationKey = config.get<string>('secrets.cmc.AppInsightsInstrumentationKey')
    appInsights.setup(aiInstrumentationKey)
      .setAutoCollectConsole(true, true)
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get<string>('appInsights.roleName')

    appInsights.defaultClient.addTelemetryProcessor(telemetryProcessors.operationNameUUIDHider())

    if (aiInstrumentationKey === 'STDOUT') {
      appInsights.defaultClient.addTelemetryProcessor(telemetryProcessors.errorLogger(logger))
    }

    appInsights.start()
  }
}
