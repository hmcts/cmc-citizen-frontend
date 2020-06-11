"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ccbcCaseIdentifiers = require(path_1.join(__dirname, '..', '..', 'resources', 'ccbc_case_identifiers.json'));
/**
 * Checks against a list of CCBC case IDs and if they contained in the string provided
 * returns true
 * @param {string} referenceNumber the reference number, returns false if not provided
 * @returns {boolean} if the reference is likely a CCBC reference
 */
function isCCBCCaseReference(referenceNumber) {
    if (!referenceNumber) {
        return false;
    }
    return /[A-Z][0-9][A-Z0-9]{2}[0-9][A-Z0-9]{3}/i.test(referenceNumber)
        || (/^\d\d\d\D\D\d\d\d$/i.test(referenceNumber)
            && ccbcCaseIdentifiers.filter((id) => referenceNumber.toUpperCase().includes(id)).length > 0);
}
exports.isCCBCCaseReference = isCCBCCaseReference;
