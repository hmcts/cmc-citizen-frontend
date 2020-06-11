"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unused-expression
const app_insights_1 = require("modules/app-insights");
const applicationinsights_1 = require("applicationinsights");
const chai_1 = require("chai");
class TelemetryClientStub extends applicationinsights_1.TelemetryClient {
    constructor() {
        super('setup string');
        this.telemetryProcessors = [];
    }
    addTelemetryProcessor(telemetryProcessor) {
        this.telemetryProcessors.push(telemetryProcessor);
    }
}
describe('Application Insights facade', () => {
    it('should start without errors', () => {
        chai_1.expect(() => new app_insights_1.AppInsights('instrumentation-key', new TelemetryClientStub()).enable())
            .to.not.throw();
    });
    context('error logging telemetry processor', () => {
        let client;
        beforeEach(() => {
            client = new TelemetryClientStub();
        });
        it('should not add the error logging telemetry processor if instrumentation key is not STDOUT', () => {
            new app_insights_1.AppInsights('instrumentation key', client).prepareTelemetryProcessors();
            chai_1.expect(client.telemetryProcessors).to.have.length(1);
        });
        it('should add the error logging telemetry processor if instrumentation key is STDOUT', () => {
            new app_insights_1.AppInsights('STDOUT', client).prepareTelemetryProcessors();
            chai_1.expect(client.telemetryProcessors).to.have.length(2);
        });
    });
});
