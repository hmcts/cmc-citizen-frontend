"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringUtils_1 = require("utils/stringUtils");
const pathParameterRegex = /\/:[^\/]+/g;
/**
 *  Validates the path parameter value used in URI paths.
 *  And empty, null, undefined, string literal 'null' and 'undefined' are invalid values.
 *  This prevents undefined being passed to urls like: `/case/undefined/claim/receipt`
 */
function isValidParameterValue(parameterValue) {
    return !(stringUtils_1.StringUtils.isBlank(parameterValue) || parameterValue === 'undefined' || parameterValue === 'null');
}
class RoutablePath {
    constructor(uri, feature = true) {
        this.feature = feature;
        if (!uri || uri.trim() === '') {
            throw new Error('URI is missing');
        }
        this._uri = uri;
    }
    get uri() {
        return this._uri
            .replace(/\/index$/, ''); // remove /index from uri's
    }
    get associatedView() {
        if (!this.feature) {
            return this._uri
                .replace(pathParameterRegex, '') // remove path params
                .substring(1); // remove leading slash
        }
        const split = this._uri
            .replace(pathParameterRegex, '') // remove path params
            .substring(1) // remove leading slash
            .split('/');
        const isCaseUri = split[0] === 'case';
        const featureName = isCaseUri ? split[1] : split[0];
        const viewPath = split.slice(isCaseUri ? 2 : 1).join('/');
        return `${featureName}/views/${viewPath}`;
    }
    evaluateUri(substitutions) {
        if (substitutions === undefined || Object.keys(substitutions).length === 0) {
            throw new Error('Path parameter substitutions are required');
        }
        const path = Object.entries(substitutions).reduce((uri, substitution) => {
            const [parameterName, parameterValue] = substitution;
            if (!isValidParameterValue(parameterValue)) {
                throw new Error(`Path parameter :${parameterName} is invalid`);
            }
            const updatedUri = uri.replace(`:${parameterName}`, parameterValue);
            if (updatedUri === uri) {
                throw new Error(`Path parameter :${parameterName} is not defined`);
            }
            return updatedUri;
        }, this.uri);
        const missingParameters = path.match(pathParameterRegex);
        if (missingParameters) {
            const removeLeadingSlash = value => value.substring(1);
            throw new Error(`Path parameter substitutions for ${missingParameters.map(removeLeadingSlash).join(', ')} are missing`);
        }
        return path;
    }
}
exports.RoutablePath = RoutablePath;
