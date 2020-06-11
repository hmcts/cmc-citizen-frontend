"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const telemetryProcessors = require("modules/app-insights/telemetryProcessors");
const expect = chai.expect;
describe('app-insights telemetryProcessors', () => {
    const EMPTY = {};
    context('operationNameUUIDHider', () => {
        it('should throw error if envelope is undefined', () => {
            expect(() => telemetryProcessors.operationNameUUIDHider()(undefined)).to.throw();
        });
        it('should return true', () => {
            expect(telemetryProcessors.operationNameUUIDHider()(EMPTY)).to.be.true;
        });
        it('should modify operation name tag with uuid when not a static file', () => {
            let envelope = {
                tags: { 'ai.operation.name': 'GET /somewhere/01234567-89ab-4cde-af01-23456789abcd/something' }
            };
            expect(telemetryProcessors.operationNameUUIDHider()(envelope)).to.be.true;
            expect(envelope.tags['ai.operation.name']).to.equal('GET /somewhere/{uuid}/something');
        });
        it('should not modify operation name tag with uuid when a static file', () => {
            const operationName = 'GET /somewhere/01234567-89ab-4cde-af01-23456789abcd/something.file';
            let envelope = {
                tags: { 'ai.operation.name': operationName }
            };
            expect(telemetryProcessors.operationNameUUIDHider()(envelope)).to.be.true;
            expect(envelope.tags['ai.operation.name']).to.equal(operationName);
        });
        it('should not modify operation name tag without uuid when not a static file', () => {
            const operationName = 'GET /somewhere/notauuid/something';
            let envelope = {
                tags: { 'ai.operation.name': operationName }
            };
            expect(telemetryProcessors.operationNameUUIDHider()(envelope)).to.be.true;
            expect(envelope.tags['ai.operation.name']).to.equal(operationName);
        });
    });
    context('errorLogger', () => {
        const ERROR = {
            data: { baseData: {
                    name: 'Test error name',
                    properties: { error: 'Test error description' }
                } }
        };
        it('should throw not error if logger is undefined when envelope is empty', () => {
            expect(() => telemetryProcessors.errorLogger(undefined)(EMPTY)).to.not.throw();
        });
        it('should return true', () => {
            expect(telemetryProcessors.errorLogger(undefined)(EMPTY)).to.be.true;
        });
        it('should throw error if logger is undefined when envelope holds error data', () => {
            expect(() => telemetryProcessors.errorLogger(undefined)(ERROR)).to.throw();
        });
        it('should log the error if logger is valid and envelope holds error data', () => {
            const stack = [];
            const logger = {
                stack: [],
                info: (message) => {
                    stack.push(message);
                }
            };
            expect(telemetryProcessors.errorLogger(logger)(ERROR)).to.be.true;
            expect(stack).to.have.length(1);
            expect(stack[0]).to.be.equal(`AppInsights error: {"name":"Test error name","error":"Test error description"}`);
        });
    });
});
