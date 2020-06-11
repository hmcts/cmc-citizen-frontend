"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const supportRequired_1 = require("directions-questionnaire/forms/models/supportRequired");
describe('SupportRequired', () => {
    describe('validation', () => {
        context('Should validate successfully when', () => {
            it('When everything is undefined', () => {
                const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired());
                chai_1.expect(errors).to.be.empty;
            });
            it('When languageSelected and languageInterpreted are set', () => {
                const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired(true, 'language'));
                chai_1.expect(errors).to.be.empty;
            });
            it('When signLanguageSelected and signLanguageInterpreted are set', () => {
                const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                    signLanguageSelected: true,
                    signLanguageInterpreted: 'language'
                }));
                chai_1.expect(errors).to.be.empty;
            });
            it('When otherSupportSelected and otherSupport are set', () => {
                const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                    otherSupportSelected: true,
                    otherSupport: 'otherSupport'
                }));
                chai_1.expect(errors).to.be.empty;
            });
            it('When everything is set', () => {
                const supportRequired = new supportRequired_1.SupportRequired(true, 'language', true, 'language', true, true, true, 'other support');
                const errors = new class_validator_1.Validator().validateSync(supportRequired);
                chai_1.expect(errors).to.be.empty;
            });
        });
        context('Should fail validation when', () => {
            context('When languageSelected is set to true', () => {
                it('When languageInterpreted is undefined', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired(true, undefined));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_LANGUAGE_ENTERED);
                });
                it('When languageInterpreted is empty', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired(true, ''));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_LANGUAGE_ENTERED);
                });
            });
            context('When signLanguageSelected is set to true', () => {
                it('When signLanguageInterpreted is undefined', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                        signLanguageSelected: true,
                        signLanguageInterpreted: undefined
                    }));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_SIGN_LANGUAGE_ENTERED);
                });
                it('When signLanguageInterpreted is empty', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                        signLanguageSelected: true,
                        signLanguageInterpreted: ''
                    }));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_SIGN_LANGUAGE_ENTERED);
                });
            });
            context('When otherSupportSelected is set to true', () => {
                it('When otherSupport is undefined', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                        otherSupportSelected: true,
                        otherSupport: undefined
                    }));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_OTHER_SUPPORT);
                });
                it('When otherSupport is empty', () => {
                    const errors = new class_validator_1.Validator().validateSync(new supportRequired_1.SupportRequired().deserialize({
                        otherSupportSelected: true,
                        otherSupport: ''
                    }));
                    chai_1.expect(errors).to.not.be.empty;
                    validationUtils_1.expectValidationError(errors, supportRequired_1.ValidationErrors.NO_OTHER_SUPPORT);
                });
            });
        });
    });
    describe('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = supportRequired_1.SupportRequired.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
        it(`valid object with valid input`, () => {
            const model = supportRequired_1.SupportRequired.fromObject({ languageSelected: true });
            chai_1.expect(model.languageSelected).to.be.eq(true);
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new supportRequired_1.SupportRequired().deserialize(undefined)).to.be.eql(new supportRequired_1.SupportRequired());
        });
        it('should return an instance from given object', () => {
            const actual = new supportRequired_1.SupportRequired().deserialize({ languageSelected: true });
            chai_1.expect(actual).to.be.eql(new supportRequired_1.SupportRequired(true));
        });
    });
});
