"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromise = require("request-promise-native");
const address_1 = require("./address");
const court_1 = require("./court");
const courtFinderResponse_1 = require("./courtFinderResponse");
const config = require("config");
const courtDetailsResponse_1 = require("court-finder-client/courtDetailsResponse");
const courtDetails_1 = require("court-finder-client/courtDetails");
class CourtFinderClient {
    constructor(apiUrl = `${config.get('claim-store.url')}`, request = requestPromise) {
        this.apiUrl = apiUrl;
        this.request = request;
        this.postCodeSearchUrl = `${this.apiUrl}/court-finder/search-postcode/`;
    }
    findMoneyClaimCourtsByPostcode(postcode) {
        if (!postcode) {
            return Promise.reject('Missing postcode');
        }
        return this.performRequest(this.postCodeSearchUrl + `${postcode}`);
    }
    getCourtDetails(slug) {
        if (!slug) {
            return Promise.reject('Missing slug');
        }
        const uri = `${this.apiUrl}/court-finder/court-details/${slug}`;
        return this.performCourtDetailsRequest(uri);
    }
    performRequest(uri) {
        return this.request.get({
            json: false,
            resolveWithFullResponse: true,
            simple: false,
            uri: `${uri}`
        }).then((response) => {
            if (response.statusCode !== 200) {
                return new courtFinderResponse_1.CourtFinderResponse(response.statusCode, false);
            }
            const courtFinderResponse = new courtFinderResponse_1.CourtFinderResponse(200, true);
            const responseBody = JSON.parse(response.body);
            courtFinderResponse.addAll(responseBody.map((court) => {
                return new court_1.Court(court.name, court.slug, new address_1.Address(court.address.address_lines, court.address.postcode, court.address.town, court.address.type));
            }));
            return courtFinderResponse;
        });
    }
    performCourtDetailsRequest(uri) {
        return this.request.get({
            json: false,
            resolveWithFullResponse: true,
            simple: false,
            uri: `${uri}`
        }).then((response) => {
            if (response.statusCode !== 200) {
                return new courtDetailsResponse_1.CourtDetailsResponse(response.statusCode, false);
            }
            const courtDetailsResponse = new courtDetailsResponse_1.CourtDetailsResponse(200, true);
            const responseBody = JSON.parse(response.body);
            courtDetailsResponse.courtDetails = new courtDetails_1.CourtDetails(responseBody.name, responseBody.slug, responseBody.facilities);
            return courtDetailsResponse;
        });
    }
}
exports.CourtFinderClient = CourtFinderClient;
