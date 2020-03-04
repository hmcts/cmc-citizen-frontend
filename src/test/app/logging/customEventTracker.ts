import { trackCustomEvent, trackTrace } from 'logging/customEventTracker'
import * as appInsights from 'applicationinsights'

describe('customEventTracker', () => {
  it('should not crash before or after starting appinsights', () => {
    trackCustomEvent('event name', {})
    trackTrace('custom trace')

    appInsights.setup('STDOUT')
    appInsights.start()

    trackCustomEvent('event name', {})
    trackTrace('custom trace')
  })
})
