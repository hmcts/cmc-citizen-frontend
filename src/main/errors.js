"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("claim/paths");
class NotFoundError extends Error {
    constructor(page) {
        super(`Page ${page} does not exist`);
        this.statusCode = 404;
        this.associatedView = 'not-found';
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends Error {
    constructor() {
        super(`You are not allowed to access this resource`);
        this.statusCode = 403;
        this.associatedView = 'forbidden';
    }
}
exports.ForbiddenError = ForbiddenError;
class ClaimAmountExceedsLimitError extends Error {
    constructor(message = ClaimAmountExceedsLimitError.AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT) {
        super(message);
        this.message = message;
        this.statusCode = 302;
        this.associatedView = paths_1.ErrorPaths.amountExceededPage.uri;
        this.name = 'ClaimAmountExceedsLimitError';
    }
}
exports.ClaimAmountExceedsLimitError = ClaimAmountExceedsLimitError;
ClaimAmountExceedsLimitError.AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT = 'The total claim amount exceeds the stated limit of 10000';
