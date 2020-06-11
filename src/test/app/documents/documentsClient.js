"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const documentsClient_1 = require("documents/documentsClient");
describe('DocumentsClient', () => {
    const client = new documentsClient_1.DocumentsClient();
    const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF';
    const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
    it('should throw error when given undefined ExternalId', () => {
        chai_1.expect(() => client.getDefendantResponseReceiptPDF(undefined, bearerToken))
            .to.throw(Error, 'Claim external ID cannot be blank');
    });
    it('should throw error when given empty ExternalId', () => {
        chai_1.expect(() => client.getDefendantResponseReceiptPDF('', bearerToken))
            .to.throw(Error, 'Claim external ID cannot be blank');
    });
    it('should throw error when not given undefined bearerToken', () => {
        chai_1.expect(() => client.getDefendantResponseReceiptPDF(externalId, undefined))
            .to.throw(Error, 'User authorisation cannot be blank');
    });
    it('should throw error when not given an empty bearerToken', () => {
        chai_1.expect(() => client.getDefendantResponseReceiptPDF(externalId, ''))
            .to.throw(Error, 'User authorisation cannot be blank');
    });
    it('should throw error when not given an empty bearerToken to getPDF', () => {
        chai_1.expect(() => client.getPDF(externalId, 'ORDER_DIRECTIONS', ''))
            .to.throw(Error, 'User authorisation cannot be blank');
    });
    it('should throw error when given empty ExternalId to getPDF', () => {
        chai_1.expect(() => client.getPDF('', 'ORDER_DIRECTIONS', bearerToken))
            .to.throw(Error, 'Claim external ID cannot be blank');
    });
});
