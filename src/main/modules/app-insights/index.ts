import * as config from 'config'
import * as appInsights from 'applicationinsights'

declare class AppInsightsConfiguration {
  instrumentationKey: string
  roleName: string
}

export class AppInsights {
  static enable () {
    const appInsightsConfig = config.get<AppInsightsConfiguration>('appInsights')

    appInsights.setup(appInsightsConfig.instrumentationKey)
      .setAutoCollectConsole(true, true)
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = appInsightsConfig.roleName
    appInsights.start()
  }
}
