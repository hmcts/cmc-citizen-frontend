"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const expertReports_1 = require("directions-questionnaire/forms/models/expertReports");
const chai_1 = require("chai");
const reportRow_1 = require("directions-questionnaire/forms/models/reportRow");
const localDate_1 = require("forms/models/localDate");
const momentFactory_1 = require("shared/momentFactory");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
describe('Expert Reports', () => {
    context('constructor', () => {
        const fiveDaysAgo = localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().subtract(5, 'days'));
        it('should use defaults when no parameters given', () => {
            const reports = new expertReports_1.ExpertReports();
            chai_1.expect(reports.declared).to.be.undefined;
            chai_1.expect(reports.rows).to.have.length(1);
            chai_1.expect(reports.rows[0].expertName).to.be.undefined;
            chai_1.expect(reports.rows[0].reportDate).to.be.undefined;
        });
        it('should use provided parameters', () => {
            const reports = new expertReports_1.ExpertReports(yesNoOption_1.YesNoOption.YES, [new reportRow_1.ReportRow('Mr Blobby', fiveDaysAgo)]);
            chai_1.expect(reports.declared).to.equal(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(reports.rows).to.have.length(1);
            chai_1.expect(reports.rows[0].expertName).to.equal('Mr Blobby');
            chai_1.expect(reports.rows[0].reportDate).to.deep.equal(fiveDaysAgo);
        });
    });
    context('from form object', () => {
        it('returns same falsy value', () => {
            chai_1.expect(expertReports_1.ExpertReports.fromObject(undefined)).to.be.undefined;
            chai_1.expect(expertReports_1.ExpertReports.fromObject(null)).to.be.null;
        });
        it('returns expected values', () => {
            const reports = expertReports_1.ExpertReports.fromObject({
                declared: yesNoOption_1.YesNoOption.YES.option,
                rows: [{ expertName: 'Mr Blobby', reportDate: { year: 2018, month: 4, day: 13 } }]
            });
            chai_1.expect(reports.declared).to.equal(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(reports.rows).to.have.length(1);
            chai_1.expect(reports.rows[0].expertName).to.equal('Mr Blobby');
            chai_1.expect(reports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 4, day: 13 });
        });
    });
    context('deserialize', () => {
        it('should return unchanged object when deserializing falsy', () => {
            const reports = new expertReports_1.ExpertReports();
            chai_1.expect(reports.deserialize(undefined)).to.deep.equal(reports);
            chai_1.expect(reports.deserialize(null)).to.deep.equal(reports);
        });
        it('should deserialize false sensibly', () => {
            const reports = new expertReports_1.ExpertReports().deserialize({
                declared: yesNoOption_1.YesNoOption.NO.option
            });
            chai_1.expect(reports.declared).to.equal(yesNoOption_1.YesNoOption.NO.option);
            chai_1.expect(reports.rows).to.be.empty;
        });
        it('should deserialize populated values sensibly', () => {
            const reports = new expertReports_1.ExpertReports().deserialize({
                declared: yesNoOption_1.YesNoOption.YES.option,
                rows: [{ expertName: 'Stephen Hawking', reportDate: { year: 2018, month: 3, day: 14 } }]
            });
            chai_1.expect(reports.declared).to.equal(yesNoOption_1.YesNoOption.YES.option);
            chai_1.expect(reports.rows).to.have.length(1);
            chai_1.expect(reports.rows[0].expertName).to.equal('Stephen Hawking');
            chai_1.expect(reports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 3, day: 14 });
        });
    });
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject null', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports(null, null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject without declaration', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject when reports declared but none provided', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, expertReports_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
        });
        it('should reject a report with a future date', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports(yesNoOption_1.YesNoOption.YES, [
                new reportRow_1.ReportRow('A', localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().add(1, 'day')))
            ]));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, reportRow_1.ValidationErrors.PAST_DATE_REQUIRED);
        });
        it('should accept affirmed reports with valid data', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports(yesNoOption_1.YesNoOption.YES, [
                new reportRow_1.ReportRow('B', localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().subtract(1, 'day')))
            ]));
            chai_1.expect(errors).to.be.empty;
        });
        it('should accept declined reports', () => {
            const errors = validator.validateSync(new expertReports_1.ExpertReports(yesNoOption_1.YesNoOption.NO, []));
            chai_1.expect(errors).to.be.empty;
        });
    });
});
