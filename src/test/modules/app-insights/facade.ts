// tslint:disable:no-unused-expression
import { AppInsights } from 'modules/app-insights'
import { expect } from 'chai'
import { TelemetryClient } from 'applicationinsights'

describe('Application Insights facade', () => {
  context('error logging telemetry processor', () => {
    class TelemetryClientStub extends TelemetryClient {
      public telemetryProcessors: any[] = []

      constructor () {
        super('')
      }

      addTelemetryProcessor (telemetryProcessor): void {
        this.telemetryProcessors.push(telemetryProcessor)
      }
    }

    let client: TelemetryClientStub

    beforeEach(() => {
      client = new TelemetryClientStub()
    })

    it('should not add the error logging telemetry processor if instrumentation key is not STDOUT', () => {
      new AppInsights('instrumentation key', client).prepareTelemetryProcessors()
      expect(client.telemetryProcessors).to.have.length(1)
    })

    it('should add the error logging telemetry processor if instrumentation key is STDOUT', () => {
      new AppInsights('STDOUT', client).prepareTelemetryProcessors()
      expect(client.telemetryProcessors).to.have.length(2)
    })
  })
})
