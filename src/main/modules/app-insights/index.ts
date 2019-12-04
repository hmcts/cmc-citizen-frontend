import * as config from 'config'
import * as appInsights from 'applicationinsights'
import * as telemetryProcessors from './telemetryProcessors'
import { LoggerInstance } from 'winston'
import { Logger } from '@hmcts/nodejs-logging'

const logger: LoggerInstance = Logger.getLogger('customEventTracker')

export class AppInsights {
  private readonly instrumentationKey: string
  private client?: appInsights.TelemetryClient

  constructor (instrumentationKey?: string, client?: appInsights.TelemetryClient) {
    this.instrumentationKey = instrumentationKey
      ? instrumentationKey
      : config.get<string>('secrets.cmc.AppInsightsInstrumentationKey')
    this.client = client
      ? client
      : appInsights.defaultClient
  }

  enable () {
    this.setup()
    this.prepareClientContext(config.get<string>('appInsights.roleName'))
    this.prepareTelemetryProcessors()
    this.start()
  }

  setup (): typeof appInsights.Configuration {
    return appInsights.setup(this.instrumentationKey).setAutoCollectConsole(true, true)
  }

  prepareClientContext (cloudRole: string) {
    this.client.context.tags[this.client.context.keys.cloudRole] = cloudRole
  }

  prepareTelemetryProcessors () {
    this.client.addTelemetryProcessor(telemetryProcessors.operationNameUUIDHider())
    if (this.instrumentationKey === 'STDOUT') {
      this.client.addTelemetryProcessor(telemetryProcessors.errorLogger(logger))
    }
  }

  start () {
    appInsights.start()
  }
}
