"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkDefined(value, errorMessage) {
    if (value == null) {
        throw new Error(errorMessage);
    }
}
exports.checkDefined = checkDefined;
function checkNotEmpty(value, errorMessage) {
    checkDefined(value, errorMessage);
    if (value.length === 0) {
        throw new Error(errorMessage);
    }
}
exports.checkNotEmpty = checkNotEmpty;
