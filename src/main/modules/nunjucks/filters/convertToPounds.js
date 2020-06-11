"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToPoundsFilter(value) {
    if (!value || !(typeof value === 'number')) {
        throw new Error('Value should be a number');
    }
    return value / 100;
}
exports.convertToPoundsFilter = convertToPoundsFilter;
