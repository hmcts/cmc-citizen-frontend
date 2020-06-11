"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const request_1 = require("client/request");
const preconditions_1 = require("shared/preconditions");
const config = require("config");
const HttpStatus = require("http-status-codes");
const payment_1 = require("payment-hub-client/payment");
const paymentRetrieveResponse_1 = require("payment-hub-client/paymentRetrieveResponse");
const baseURL = `${config.get('pay.url')}/card-payments`;
const paymentURL = `${config.get('pay.url')}/payments`;
const serviceName = config.get('pay.service-name');
const currency = config.get('pay.currency');
const siteId = config.get('pay.site-id');
const description = config.get('pay.description');
class GovPayClient {
    constructor(serviceAuthToken) {
        this.serviceAuthToken = serviceAuthToken;
        this.serviceAuthToken = serviceAuthToken;
    }
    async create(user, externalId, fees, returnURL) {
        preconditions_1.checkDefined(user, 'User is required');
        preconditions_1.checkNotEmpty(externalId, 'ExternalId is required');
        preconditions_1.checkNotEmpty(fees, 'Fees array is required');
        preconditions_1.checkNotEmpty(returnURL, 'Post payment redirect URL is required');
        const options = {
            method: 'POST',
            uri: baseURL,
            body: this.preparePaymentRequest(externalId, fees),
            headers: {
                Authorization: `Bearer ${user.bearerToken}`,
                ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`,
                'return-url': `${returnURL}`
            }
        };
        return request_1.request(options).then(function (response) {
            return payment_1.Payment.deserialize(response);
        });
    }
    async retrieve(user, paymentReference) {
        preconditions_1.checkDefined(user, 'User is required');
        preconditions_1.checkNotEmpty(paymentReference, 'Payment reference is required');
        const options = {
            uri: `${baseURL}/${paymentReference}`,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`,
                ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return class_transformer_1.plainToClass(paymentRetrieveResponse_1.PaymentRetrieveResponse, response);
        }).catch(function (err) {
            if (err.statusCode === HttpStatus.NOT_FOUND) {
                return undefined;
            }
            throw err;
        });
    }
    async update(user, paymentReference, caseReference, caseNumber) {
        preconditions_1.checkDefined(user, 'User is required');
        preconditions_1.checkNotEmpty(paymentReference, 'Payment reference is required');
        preconditions_1.checkNotEmpty(caseReference, 'Case Reference is required');
        preconditions_1.checkNotEmpty(caseNumber, 'Case Number is required');
        return request_1.request.patch({
            uri: `${paymentURL}/${paymentReference}`,
            body: this.preparePaymentUpdateRequest(caseReference, caseNumber),
            headers: {
                Authorization: `Bearer ${user.bearerToken}`,
                ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
            }
        }).then(() => Promise.resolve())
            .catch(() => Promise.reject());
    }
    preparePaymentUpdateRequest(caseReference, caseNumber) {
        return {
            case_reference: caseReference,
            ccd_case_number: caseNumber
        };
    }
    preparePaymentRequest(externalId, fees) {
        return {
            case_reference: externalId,
            ccd_case_number: 'UNKNOWN',
            description: description,
            service: serviceName,
            currency: currency,
            site_id: siteId,
            fees: fees,
            amount: fees.reduce((amount, fee) => {
                return amount + fee.calculated_amount;
            }, 0)
        };
    }
}
exports.GovPayClient = GovPayClient;
