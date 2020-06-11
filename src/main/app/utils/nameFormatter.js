"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringUtils_1 = require("utils/stringUtils");
class NameFormatter {
    static fullName(firstName, lastName, title) {
        return [stringUtils_1.StringUtils.trimToUndefined(title), firstName, lastName].filter(Boolean).join(' ');
    }
}
exports.NameFormatter = NameFormatter;
