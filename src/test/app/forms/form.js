"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const form_1 = require("forms/form");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
function newValidationError(property, constraints, childern) {
    const instance = new class_validator_1.ValidationError();
    instance.property = property;
    instance.constraints = constraints;
    instance.children = childern;
    return instance;
}
const validationError = newValidationError('address[city]', {
    'IsNotEmpty': 'City must be empty'
});
describe('Form', () => {
    describe('Converter', () => {
        it('should convert simple form field to object property', () => {
            chai_1.expect(form_1.Converter.asProperty('address[city]')).to.equal('address.city');
        });
        it('should convert simple object property to form field', () => {
            chai_1.expect(form_1.Converter.asFieldName('address.city')).to.equal('address[city]');
        });
        it('should convert nested form field to object property', () => {
            chai_1.expect(form_1.Converter.asProperty('claimant[address][city]')).to.equal('claimant.address.city');
        });
        it('should convert nested object property to form field', () => {
            chai_1.expect(form_1.Converter.asFieldName('claimant.address.city')).to.equal('claimant[address][city]');
        });
    });
    describe('FormValidationError', () => {
        it('should have all properties of ValidationError', () => {
            const formValidationError = new form_1.FormValidationError(validationError);
            chai_1.expect(formValidationError.value).to.equal(validationError.value);
            chai_1.expect(formValidationError.property).to.equal(validationError.property);
            chai_1.expect(formValidationError.constraints).to.equal(validationError.constraints);
        });
        it('should have form field name populated', () => {
            const formValidationError = new form_1.FormValidationError(validationError);
            chai_1.expect(formValidationError.fieldName).to.equal('address[city]');
        });
        it('should have message populated', () => {
            const formValidationError = new form_1.FormValidationError(validationError);
            chai_1.expect(formValidationError.message).to.equal('City must be empty');
        });
        describe('new instance creation', () => {
            it('should flatten nested validation errors into single errors array', () => {
                const simpleError = newValidationError('amount', {
                    'IsDefined': 'Total amount is required'
                });
                const nestedError = newValidationError('rows', {}, [
                    newValidationError('0', {}, [
                        newValidationError('reason', {
                            'IsDefined': 'Reason is required'
                        })
                    ]),
                    newValidationError('1', {}, [
                        newValidationError('amount', {
                            'IsDefined': 'Amount is required'
                        })
                    ])
                ]);
                const form = new form_1.Form(null, [simpleError, nestedError]);
                chai_1.expect(form.errors.length).to.equal(3);
                validationUtils_1.expectPropertyValidationError(form.errors, 'amount', 'Total amount is required');
                validationUtils_1.expectPropertyValidationError(form.errors, 'rows.0.reason', 'Reason is required');
                validationUtils_1.expectPropertyValidationError(form.errors, 'rows.1.amount', 'Amount is required');
            });
        });
        it('should be invalid when at least one error is in the errors array', () => {
            const form = new form_1.Form(null, [validationError]);
            chai_1.expect(form.hasErrors()).to.equal(true);
        });
        it('should be valid when there is not errors in the errors array', () => {
            const form = new form_1.Form(null, []);
            chai_1.expect(form.hasErrors()).to.equal(false);
        });
        it('should return error message if error associated with given field exists', () => {
            const form = new form_1.Form(null, [validationError]);
            chai_1.expect(form.errorFor('address[city]')).to.equal('City must be empty');
        });
        it('should return undefined if error associated with given field does not exist', () => {
            const form = new form_1.Form(null, []);
            chai_1.expect(form.errorFor('address[city]')).to.equal(undefined);
        });
        it('should return value if value associated with given field exists', () => {
            const form = new form_1.Form({ address: { city: 'London' } });
            chai_1.expect(form.valueFor('address[city]')).to.equal('London');
        });
        it('should return raw value from request body', () => {
            const form = new form_1.Form({ amount: '1,45' }, [], { amount: '1,45' });
            chai_1.expect(form.rawDataFor('amount')).to.equal('1,45');
        });
        it('should return undefined if value associated with given field does not exist', () => {
            const form = new form_1.Form({});
            chai_1.expect(form.valueFor('address[city]')).to.equal(undefined);
        });
    });
});
