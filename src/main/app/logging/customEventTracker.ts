import * as appInsights from 'applicationinsights'

export function trackCustomEvent (eventName: string, trackingProperties: {}): void {
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackEvent({
      name: eventName,
      properties: trackingProperties
    })
  }
}
