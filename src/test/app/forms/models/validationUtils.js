"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const randomstring = require("randomstring");
class Violation {
    constructor(property, message) {
        this.property = property;
        this.message = message;
    }
}
function expectNumberOfValidationErrors(errors, expectation) {
    chai_1.expect(errors.length).to.be.equal(expectation, `Number of errors found (${errors.length}) is not equal ${expectation}. ${stringifyViolations(extractViolationsFrom(errors))}`);
}
exports.expectNumberOfValidationErrors = expectNumberOfValidationErrors;
function expectValidationError(errors, message) {
    const violations = extractViolationsFrom(errors);
    chai_1.expect(violations.map(violation => violation.message)).to.include(message, `Error '${message}' has not been found. ${stringifyViolations(violations)}`);
}
exports.expectValidationError = expectValidationError;
function expectValidationErrorNotPresent(errors, message) {
    const violations = extractViolationsFrom(errors);
    chai_1.expect(violations.map(violation => violation.message)).to.not.include(message, `Error '${message}' has been found. ${stringifyViolations(violations)}`);
}
exports.expectValidationErrorNotPresent = expectValidationErrorNotPresent;
function expectPropertyValidationError(errors, property, message) {
    const violations = extractViolationsFrom(errors);
    chai_1.expect(violations).to.deep.include(new Violation(property, message), `Error '${message}' on property '${property}' has not been found. ${stringifyViolations(violations)}`);
}
exports.expectPropertyValidationError = expectPropertyValidationError;
function extractViolationsFrom(errors, parentProperty) {
    function property(error) {
        return parentProperty ? `${parentProperty}.${error.property}` : error.property;
    }
    return _.flattenDeep(errors.map((error) => {
        if (error.children && error.children.length > 0) {
            return extractViolationsFrom(error.children, parentProperty);
        }
        else {
            return Object.values(error.constraints).map((message) => new Violation(property(error), message));
        }
    }));
}
/**
 * Returns string containing list of violations grouped by property e.g.
 *
 * <ul>
 *  <li>property 'date':
 *   <ul>
 *     <li>'Enter date before 3 January 2018'</li>
 *   </ul>
 *  </li>
 *  <li>property 'text':
 *   <ul>
 *     <li>'Explain why you don’t owe the full amount'</li>
 *     <li>'You’ve entered too many characters'</li>
 *   </ul>
 *  </li>
 * </ul>
 */
function stringifyViolations(violations) {
    const errors = _(violations)
        .groupBy((violation) => violation.property)
        .map((violations, property) => {
        return ` - property '${property}':\n${violations.map((violation) => {
            return `  - '${violation.message}'\n`;
        })}`;
    })
        .join('');
    return `\n\nThe following errors has been triggered:\n${errors}\n`;
}
function generateString(length) {
    return randomstring.generate({
        length: length,
        charset: 'alphabetic'
    });
}
exports.generateString = generateString;
function evaluateErrorMsg(errorMsg, value) {
    return errorMsg.replace('$constraint1', value.toString());
}
exports.evaluateErrorMsg = evaluateErrorMsg;
