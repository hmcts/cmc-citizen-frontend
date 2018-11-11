import * as appInsights from 'applicationinsights'

export function trackCustomEvent (eventName: string, trackingProperties: {}) {
  appInsights.defaultClient.trackEvent({
    name: eventName,
    properties: trackingProperties
  })
}
