import * as config from 'config'
import * as appInsights from 'applicationinsights'
import * as telemetryProcessors from './telemetryProcessors'
import { LoggerInstance } from 'winston'
import { Logger } from '@hmcts/nodejs-logging'

const logger: LoggerInstance = Logger.getLogger('customEventTracker')

export class AppInsights {
  private readonly instrumentationKey: string
  private client: appInsights.TelemetryClient

  constructor (instrumentationKey?: string, client?: appInsights.TelemetryClient) {
    this.instrumentationKey = instrumentationKey || config.get<string>('secrets.cmc.AppInsightsInstrumentationKey')
    this.client = client || appInsights.defaultClient
  }

  enable () {
    this.setup()
    this.prepareClientContext(config.get<string>('appInsights.roleName'))
    this.prepareTelemetryProcessors()
    this.start()
  }

  setup (): typeof appInsights.Configuration {
    return appInsights.setup(this.instrumentationKey)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .setSendLiveMetrics(true)
      .setAutoCollectConsole(true, true)
  }

  getClient () {
    if (!this.client) {
      this.client = appInsights.defaultClient
    }
    return this.client
  }

  prepareClientContext (cloudRole: string) {
    this.getClient().context.tags[this.client.context.keys.cloudRole] = cloudRole
  }

  prepareTelemetryProcessors () {
    this.getClient().addTelemetryProcessor(telemetryProcessors.operationNameUUIDHider())
    if (this.instrumentationKey === 'STDOUT') {
      this.client.addTelemetryProcessor(telemetryProcessors.errorLogger(logger))
      this.client.addTelemetryProcessor(telemetryProcessors.traceLogger(logger))
    }
  }

  start () {
    appInsights.start()
  }
}
