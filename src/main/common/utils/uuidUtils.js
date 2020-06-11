"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
class UUIDUtils {
    /**
     * Extracts first UUID from given string. Returns UUID or undefined if UUID does not exists in the string value.
     */
    static extractFrom(value) {
        if (value === undefined) {
            throw new Error('String to extract UUID from is required');
        }
        const matches = value.match(pattern);
        if (matches !== null) {
            return matches[1];
        }
        return undefined;
    }
}
exports.UUIDUtils = UUIDUtils;
