"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToRawObject(object) {
    return JSON.parse(JSON.stringify(object));
}
exports.convertToRawObject = convertToRawObject;
