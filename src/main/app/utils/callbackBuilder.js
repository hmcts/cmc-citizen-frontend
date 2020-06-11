"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringUtils_1 = require("utils/stringUtils");
function buildURL(req, path) {
    if (stringUtils_1.StringUtils.isBlank(path)) {
        throw new Error('Path null or undefined');
    }
    if (req === undefined) {
        throw new Error('Request is undefined');
    }
    const protocol = 'https://';
    const host = req.headers.host;
    const baseURL = `${protocol}${host}`;
    if (path.startsWith('/')) {
        return baseURL + path;
    }
    else {
        return `${baseURL}/${path}`;
    }
}
exports.buildURL = buildURL;
