"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock = require("nock");
const HttpStatus = require("http-status-codes");
const config = require("config");
const baseURL = config.get('pay.url');
const endpointPath = '/card-payments';
const paymentsPath = '/payments';
exports.paymentInitiateResponse = {
    reference: 'RC-1520-4225-4161-2265',
    date_created: '2018-03-07T11:35:42.095+0000',
    status: 'Initiated',
    _links: {
        next_url: {
            href: 'https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8',
            method: 'GET'
        }
    }
};
const paymentRetrieveResponse = {
    amount: 60,
    description: 'Money Claim issue fee',
    reference: 'RC-1520-4276-0065-8715',
    currency: 'GBP',
    ccd_case_number: 'UNKNOWN',
    case_reference: 'dfd75bac-6d54-4c7e-98f7-50e047d7c7f5',
    channel: 'online',
    method: 'card',
    external_provider: 'gov pay',
    status: 'Success',
    external_reference: 'h8mtngl42o4i8ajrq64mdqufhl',
    site_id: 'AA00',
    service_name: 'Civil Money Claims',
    fees: [
        {
            code: 'X0026',
            version: '1',
            calculated_amount: 60
        }
    ],
    _links: {
        self: {
            href: 'http://localhost:4421/card-payments/RC-1520-4276-0065-8715',
            method: 'GET'
        }
    }
};
function resolveCreate() {
    mock(baseURL)
        .post(endpointPath)
        .reply(HttpStatus.CREATED, exports.paymentInitiateResponse);
}
exports.resolveCreate = resolveCreate;
function rejectCreate() {
    mock(baseURL)
        .post(endpointPath)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR);
}
exports.rejectCreate = rejectCreate;
function resolveRetrieve(status) {
    mock(baseURL + endpointPath)
        .get(new RegExp(`\/[\\d]+`))
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, paymentRetrieveResponse), { status: `${status}` }));
}
exports.resolveRetrieve = resolveRetrieve;
function resolveUpdate(paymentReference = 'RC-1520-4276-0065-8715') {
    return mock(baseURL + paymentsPath)
        .patch(`/${paymentReference}`)
        .reply(HttpStatus.OK);
}
exports.resolveUpdate = resolveUpdate;
function resolveRetrieveToNotFound() {
    mock(baseURL + endpointPath)
        .get(new RegExp(`\/[\\d]+`))
        .reply(HttpStatus.NOT_FOUND);
}
exports.resolveRetrieveToNotFound = resolveRetrieveToNotFound;
function rejectRetrieve() {
    mock(baseURL + endpointPath)
        .get(new RegExp(`\/[\\d]+`))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR);
}
exports.rejectRetrieve = rejectRetrieve;
