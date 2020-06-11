"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const localDate_1 = require("forms/models/localDate");
describe('Date of Birth', () => {
    describe('isCompleted', () => {
        it('should return true when there is a date', () => {
            const dob = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(1981, 11, 11));
            chai_1.expect(dob.isCompleted()).to.equal(true);
        });
        it('should return false when there is no date', () => {
            const dob = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate());
            chai_1.expect(dob.isCompleted()).to.equal(false);
        });
    });
});
