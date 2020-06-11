"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claimant_1 = require("drafts/models/claimant");
describe('Claimant', () => {
    describe('deserialize', () => {
        it('should return a Claimant instance initialised with defaults for undefined', () => {
            chai_1.expect(new claimant_1.Claimant().deserialize(undefined)).to.eql(new claimant_1.Claimant());
        });
        it('should return a Claimant instance initialised with defaults for null', () => {
            chai_1.expect(new claimant_1.Claimant().deserialize(null)).to.eql(new claimant_1.Claimant());
        });
        it('should try to extract from old mobile field if new phone field is undefined', () => {
            const num = '07123456789';
            const actual = new claimant_1.Claimant().deserialize({ mobilePhone: { number: num } });
            chai_1.expect(actual.phone.number).to.equal(num);
        });
    });
});
