"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks if given reference number is a CMC reference number.
 *
 * @param {string} referenceNumber the reference number
 * @returns {boolean} true if the number if a CMC reference number, false otherwise
 */
function isCMCReference(referenceNumber) {
    if (!referenceNumber) {
        return false;
    }
    return /^\d\d\dMC\d\d\d$/i.test(referenceNumber);
}
exports.isCMCReference = isCMCReference;
