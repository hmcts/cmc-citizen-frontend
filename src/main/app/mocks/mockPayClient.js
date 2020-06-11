"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const uuid = require("uuid");
const momentFactory_1 = require("shared/momentFactory");
const serviceName = config.get('pay.service-name');
const siteId = config.get('pay.site-id');
const description = config.get('pay.description');
const delay = ms => new Promise(_ => setTimeout(_, ms));
class MockPayClient {
    constructor(requestUrl) {
        this.requestUrl = requestUrl;
    }
    async create(user, externalId, fees, returnURL) {
        /*
        Calculated from:
         dependencies
          | where name == "POST /card-payments"
          | summarize avg(duration)
         */
        const payCreateDelayInMs = 694;
        await delay(payCreateDelayInMs);
        const reference = `RC-${this.referencePart()}-${this.referencePart()}-${this.referencePart()}-${this.referencePart()}`;
        return Promise.resolve({
            reference: reference,
            date_created: momentFactory_1.MomentFactory.currentDateTime().toISOString(),
            status: 'Initiated',
            _links: {
                next_url: {
                    href: `${this.requestUrl}/${externalId}/receiver`,
                    method: 'GET'
                }
            }
        });
    }
    referencePart() {
        return Math.floor(1000 + Math.random() * 9000);
    }
    async retrieve(user, paymentReference) {
        /*
        Calculated from:
         dependencies
          | where name contains "GET /card-payments"
          | summarize avg(duration)
         */
        const payRetrieveDelayInMs = 681;
        await delay(payRetrieveDelayInMs);
        return Promise.resolve({
            amount: 185,
            description: description,
            reference: paymentReference,
            currency: 'GBP',
            caseReference: uuid(),
            channel: 'online',
            method: 'card',
            externalProvider: 'gov pay',
            status: 'Success',
            externalReference: 'a-gov-pay-reference',
            siteId: siteId,
            serviceName: serviceName,
            fees: [
                { calculated_amount: 185, code: 'X0029', version: '1' }
            ]
        });
    }
    async update(user, paymentReference, caseReference, caseNumber) {
        const payUpdateDelayInMs = 681;
        await delay(payUpdateDelayInMs);
        return Promise.resolve();
    }
}
exports.MockPayClient = MockPayClient;
