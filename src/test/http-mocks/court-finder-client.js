"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock = require("nock");
const HttpStatus = require("http-status-codes");
const config = require("config");
const baseURL = `${config.get('claim-store.url')}`;
const endpointPath = /\/court-finder\/search-postcode\/.+/;
const detailEndpointPath = /\/court-finder\/court-details\/.+/;
exports.searchResponse = [
    {
        name: 'Birmingham District Probate Registry',
        lat: 52.4816613587661,
        lon: -1.89552893773996,
        number: null,
        cci_code: null,
        magistrate_code: null,
        slug: 'birmingham-district-probate-registry',
        types: [],
        address: {
            address_lines: [
                'The Priory Courts',
                '33 Bull Street'
            ],
            postcode: 'B4 6DU',
            town: 'Birmingham',
            type: 'Visiting'
        },
        areas_of_law: [
            {
                name: 'Probate',
                external_link: 'https%3A//www.gov.uk/wills-probate-inheritance',
                external_link_desc: 'Information about wills and probate'
            }
        ],
        displayed: true,
        hide_aols: false,
        dx_number: '701990 Birmingham 7',
        distance: 1
    }
];
exports.courtDetailsResponse = {
    name: 'Birmingham District Probate Registry',
    slug: 'birmingham-district-probate-registry',
    facilities: []
};
function resolveFind() {
    return mock(baseURL)
        .get(endpointPath)
        .reply(HttpStatus.OK, exports.searchResponse);
}
exports.resolveFind = resolveFind;
function resolveCourtDetails() {
    return mock(baseURL)
        .get(detailEndpointPath)
        .reply(HttpStatus.OK, exports.courtDetailsResponse);
}
exports.resolveCourtDetails = resolveCourtDetails;
function rejectFind() {
    return mock(baseURL)
        .get(endpointPath)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR);
}
exports.rejectFind = rejectFind;
