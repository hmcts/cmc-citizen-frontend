"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const reportRow_1 = require("directions-questionnaire/forms/models/reportRow");
const localDate_1 = require("main/app/forms/models/localDate");
const chai_1 = require("chai");
const momentFactory_1 = require("shared/momentFactory");
const localDate_2 = require("forms/models/localDate");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('Report Rows', () => {
    context('constructor', () => {
        it('should use defaults when no parameters', () => {
            const row = new reportRow_1.ReportRow();
            chai_1.expect(row.expertName).to.be.undefined;
            chai_1.expect(row.reportDate).to.be.undefined;
        });
        it('should use provided values', () => {
            const tenDaysAgo = localDate_2.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().subtract(10, 'days'));
            const row = new reportRow_1.ReportRow('John Doe', tenDaysAgo);
            chai_1.expect(row.expertName).to.equal('John Doe');
            chai_1.expect(row.reportDate).to.deep.equal(tenDaysAgo);
        });
    });
    context('empty', () => {
        it('should return an empty row', () => {
            const row = reportRow_1.ReportRow.empty();
            chai_1.expect(row.expertName).to.be.undefined;
            chai_1.expect(row.reportDate).to.be.undefined;
        });
    });
    context('from form object', () => {
        it('returns same falsy value', () => {
            chai_1.expect(reportRow_1.ReportRow.fromObject(undefined)).to.be.undefined;
            chai_1.expect(reportRow_1.ReportRow.fromObject(null)).to.be.null;
        });
        it('returns expected values', () => {
            const row = reportRow_1.ReportRow.fromObject({
                expertName: 'John Doe',
                reportDate: { year: 2018, month: 12, day: 25 }
            });
            chai_1.expect(row.expertName).to.equal('John Doe');
            chai_1.expect(row.reportDate).to.deep.equal({ year: 2018, month: 12, day: 25 });
        });
    });
    context('deserialize', () => {
        it('should return unchanged object when deserializing falsy', () => {
            const row = new reportRow_1.ReportRow();
            chai_1.expect(row.deserialize(undefined)).to.deep.equal(row);
            chai_1.expect(row.deserialize(null)).to.deep.equal(row);
        });
        it('should deserialize values sensibly', () => {
            const row = new reportRow_1.ReportRow().deserialize({
                expertName: 'John Doe',
                reportDate: { year: 2018, month: 12, day: 25 }
            });
            chai_1.expect(row.expertName).to.equal('John Doe');
            chai_1.expect(row.reportDate).to.deep.equal({ year: 2018, month: 12, day: 25 });
        });
    });
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should accept all falsy values', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow());
            chai_1.expect(errors).to.be.empty;
        });
        it('should reject missing name when date is provided', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow(undefined, localDate_2.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate())));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, reportRow_1.ValidationErrors.NAME_REQUIRED);
        });
        it('should reject missing date when name is provided', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow('Frank Moses', undefined));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, reportRow_1.ValidationErrors.DATE_REQUIRED);
        });
        it('should reject future date', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow('Marvin Boggs', localDate_2.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().add(1, 'day'))));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, reportRow_1.ValidationErrors.PAST_DATE_REQUIRED);
        });
        it('should reject invalid date', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow('William Cooper', localDate_2.LocalDate.fromObject({ year: 2019, month: 2, day: 30 })));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, reportRow_1.ValidationErrors.VALID_DATE_REQUIRED);
        });
        it('should reject incomplete date', () => {
            const errors = validator.validateSync(new reportRow_1.ReportRow('Sarah Ross', localDate_2.LocalDate.fromObject({ year: 2019, day: 5 })));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.MONTH_NOT_VALID);
        });
    });
});
