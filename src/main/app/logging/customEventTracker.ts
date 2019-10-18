import * as appInsights from 'applicationinsights'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('customEventTracker')

export function trackCustomEvent (eventName: string, trackingProperties: {}) {
  try {
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: eventName,
        properties: trackingProperties
      })
    }
  } catch (err) {
    logger.error(err.stack)
  }
}
