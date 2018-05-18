import * as config from 'config'
import * as appInsights from 'applicationinsights'

declare class AppInsightsConfiguration {
  instrumentationKey: string
  roleName: string
}

const fileRegexp = new RegExp('(\\..{2,5}$)')
const uuidRegexp = new RegExp('[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}')

function hideUuidInUrlIfNotStaticFile (url: string): string {
  if (!fileRegexp.test(url)) {
    return url.replace(uuidRegexp, '{uuid}')
  } else {
    return url
  }
}

export class AppInsights {
  static enable () {
    const appInsightsConfig = config.get<AppInsightsConfiguration>('appInsights')

    appInsights.setup(appInsightsConfig.instrumentationKey)
      .setAutoCollectConsole(true, true)
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = appInsightsConfig.roleName

    appInsights.defaultClient.addTelemetryProcessor(function (envelope, contextObjects) {
      // hide UUID's in operationName URL's that are not static files, so they can be aggregated properly
      if (envelope.tags) {
        if (envelope.tags['ai.operation.name']) {
          envelope.tags['ai.operation.name'] = hideUuidInUrlIfNotStaticFile(envelope.tags['ai.operation.name'])
        }
      }

      // always send
      return true
    })

    appInsights.start()
  }
}
