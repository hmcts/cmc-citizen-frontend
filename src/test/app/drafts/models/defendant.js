"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const defendant_1 = require("drafts/models/defendant");
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
describe('Defendant', () => {
    describe('constructor', () => {
        it('should have undefined email', () => {
            const defendant = new defendant_1.Defendant();
            chai_1.expect(defendant.email).to.be.undefined;
        });
        it('should have undefined party details field', () => {
            const defendant = new defendant_1.Defendant();
            chai_1.expect(defendant.partyDetails).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a Defendant instance initialised with defaults for undefined', () => {
            chai_1.expect(new defendant_1.Defendant().deserialize(undefined)).to.eql(new defendant_1.Defendant());
        });
        it('should a Defendant instance initialised with defaults for null', () => {
            chai_1.expect(new defendant_1.Defendant().deserialize(null)).to.eql(new defendant_1.Defendant());
        });
        it('should try to extract from old mobile field if new phone field is undefined', () => {
            const num = '07123456789';
            const actual = new defendant_1.Defendant().deserialize({ mobilePhone: { number: num } });
            chai_1.expect(actual.phone.number).to.equal(num);
        });
    });
    describe('task state', () => {
        const defendant = {
            partyDetails: {
                type: 'individual',
                firstName: 'John',
                lastName: 'Smith',
                address: {
                    line1: 'Flat 101',
                    line2: '',
                    line3: '',
                    city: 'London',
                    postcode: 'E10AA'
                },
                hasCorrespondenceAddress: false
            },
            phone: {
                number: '07000000000'
            }
        };
        context('is incomplete', () => {
            it('when email is defined and invalid', () => {
                const state = new defendant_1.Defendant().deserialize(Object.assign(Object.assign({}, defendant), { email: { address: 'some-text' } }));
                chai_1.expect(state.isCompleted()).to.be.false;
            });
            it('when email is undefined', () => {
                const state = new defendant_1.Defendant().deserialize(Object.assign(Object.assign({}, defendant), { email: undefined }));
                chai_1.expect(state.isCompleted()).to.be.false;
            });
        });
        context('is complete', () => {
            it('when email is defined and valid', () => {
                const state = new defendant_1.Defendant().deserialize(Object.assign(Object.assign({}, defendant), { email: { address: 'user@example.com' } }));
                chai_1.expect(state.isCompleted()).to.be.true;
            });
        });
    });
});
