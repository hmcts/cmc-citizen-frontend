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

    let fileRegexp = new RegExp('(\\..{2,5}$)')
    let removeUuidRegexp = new RegExp('[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}', 'g')

    appInsights.defaultClient.addTelemetryProcessor(function (envelope, contextObjects) {
      if (contextObjects) {
        if (contextObjects.correlationContext) {
          // if there's operation, rename request having claim UUID to {uuid} mask to aggregate them correctly
          if (contextObjects.correlationContext.operation) {
            let operationName = contextObjects.correlationContext.operation.name

            // if operation's name is not static file
            if (operationName.match(fileRegexp) == null) {
              let newOperationName = operationName.replace(removeUuidRegexp, '{uuid}')
              // console.log(contextObjects.correlationContext.operation.name)
              // console.log(newOperationName)

              contextObjects.correlationContext.operation.name = newOperationName
            }
          }
        }
      }
      // always send
      return true
    })

    appInsights.start()
  }
}
