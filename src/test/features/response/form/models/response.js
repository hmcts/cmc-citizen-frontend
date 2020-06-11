"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const response_1 = require("response/form/models/response");
const responseType_1 = require("response/form/models/responseType");
describe('Response', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject interest with undefined type', () => {
            const errors = validator.validateSync(new response_1.Response(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, response_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should reject interest with unrecognised type', () => {
            const errors = validator.validateSync(new response_1.Response(new responseType_1.ResponseType('unrecognised-type', 'adas')));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, response_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should accept interest with recognised type', () => {
            responseType_1.ResponseType.all().forEach(type => {
                const errors = validator.validateSync(new response_1.Response(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
