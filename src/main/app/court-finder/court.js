"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const courtFinderClient_1 = require("court-finder-client/courtFinderClient");
class Court {
    constructor(name, slug, address) {
        this.name = name;
        this.slug = slug;
        this.address = address;
    }
    static async getNearestCourt(postcode) {
        const courtFinderClient = new courtFinderClient_1.CourtFinderClient();
        const response = await courtFinderClient.findMoneyClaimCourtsByPostcode(postcode);
        if (response.statusCode !== 200 || response.courts.length === 0) {
            return undefined;
        }
        else {
            return response.courts[0];
        }
    }
    static async getCourtDetails(slug) {
        const courtFinderClient = new courtFinderClient_1.CourtFinderClient();
        const courtDetailsResponse = await courtFinderClient.getCourtDetails(slug);
        return courtDetailsResponse.courtDetails;
    }
}
exports.Court = Court;
