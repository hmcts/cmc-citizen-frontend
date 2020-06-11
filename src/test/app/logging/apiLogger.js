"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const apiLogger_1 = require("logging/apiLogger");
process.env.LOG_LEVEL = 'DEBUG';
describe('ApiLogger', () => {
    let apiLogger;
    beforeEach(() => {
        apiLogger = new apiLogger_1.ApiLogger({});
    });
    describe('_buildRequestEntry', () => {
        let requestData;
        beforeEach(() => {
            requestData = {
                method: 'GET',
                uri: 'http://localhost/resource'
            };
        });
        it('should format the message of method and uri', () => {
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry)
                .to.contain('GET')
                .and.to.contain('http://localhost/resource');
        });
        it('should include request body if provided', () => {
            requestData.requestBody = { formField: 'formValue' };
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry).to.contain('{"formField":"formValue"}');
        });
        it('should not include request body if not provided', () => {
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry).not.to.contain('Body');
        });
        it('should include query string if provided', () => {
            requestData.query = { key: 'value' };
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry).to.contain('{"key":"value"}');
        });
        it('should not include query string if not provided', () => {
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry).not.to.contain('Query');
        });
        it('should include both request body and query string if provided', () => {
            requestData.requestBody = { formField: 'formValue' };
            requestData.query = { key: 'value' };
            let logEntry = apiLogger._buildRequestEntry(requestData);
            chai_1.expect(logEntry)
                .to.contain('{"formField":"formValue"}')
                .and.to.contain('{"key":"value"}');
        });
    });
    describe('_stringifyObject', () => {
        it('should hide pdf output', () => {
            const stringifiedObject = apiLogger._stringifyObject('%PDFasdsdasdas@1312aSDAAS');
            chai_1.expect(stringifiedObject).to.equal('**** PDF Content not shown****');
        });
    });
    describe('_buildResponseEntry', () => {
        let responseData;
        beforeEach(() => {
            responseData = {
                uri: 'http://localhost/resource',
                responseCode: 200
            };
        });
        it('should format the message of uri', () => {
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry).to.contain('http://localhost/resource');
        });
        it('should include response body if provided', () => {
            responseData.responseBody = { field: 'value' };
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry).to.contain('{"field":"value"}');
        });
        it('should not include response body if not provided', () => {
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry).not.to.contain('Body');
        });
        it('should include error if provided', () => {
            responseData.error = { message: 'Something bad happened' };
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry).to.contain('{"message":"Something bad happened"}');
        });
        it('should not include error if not provided', () => {
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry).not.to.contain('Error');
        });
        it('should include both response body and error if provided', () => {
            responseData.responseBody = { field: 'value' };
            responseData.error = { message: 'Something bad happened' };
            let logEntry = apiLogger._buildResponseEntry(responseData);
            chai_1.expect(logEntry)
                .to.contain('{"field":"value"}')
                .and.to.contain('{"message":"Something bad happened"}');
        });
    });
});
