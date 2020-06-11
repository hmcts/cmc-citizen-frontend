"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CourtFinderResponse {
    constructor(statusCode, valid) {
        this.statusCode = statusCode;
        this.valid = valid;
        this.courts = [];
    }
    addAll(additionalCourts) {
        this.courts.push(...additionalCourts);
    }
}
exports.CourtFinderResponse = CourtFinderResponse;
