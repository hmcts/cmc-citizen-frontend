// tslint:disable:no-unused-expression
import { AppInsights } from 'modules/app-insights'
import { TelemetryClient } from 'applicationinsights'
import { expect } from 'chai'

class TelemetryClientStub extends TelemetryClient {
  public telemetryProcessors: any[] = []

  constructor () {
    super('setup string')
  }

  addTelemetryProcessor (telemetryProcessor): void {
    this.telemetryProcessors.push(telemetryProcessor)
  }
}

describe('Application Insights facade', () => {
  it('should start without errors', () => {
    expect(() => new AppInsights('instrumentation key', new TelemetryClientStub()).enable())
      .to.not.throw()
  })

  context('error logging telemetry processor', () => {
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
