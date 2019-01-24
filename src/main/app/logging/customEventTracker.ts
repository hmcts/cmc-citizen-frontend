import * as appInsights from 'applicationinsights'

export function trackCustomEvent (eventName: string, trackingProperties: {}) {
  try {
    appInsights.defaultClient.trackEvent({
      name: eventName,
      properties: trackingProperties
    })
  } catch (err) {
    return
  }

}
