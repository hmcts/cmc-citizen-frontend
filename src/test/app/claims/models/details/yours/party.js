"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_1 = require("claims/models/details/yours/party");
const chai_1 = require("chai");
describe('YourDetails', () => {
    describe('deserialize', () => {
        describe('isBusiness', () => {
            it('should return false for isBusiness when type is \'individual\'', () => {
                const theirDetails = new party_1.Party().deserialize({
                    type: 'individual',
                    name: undefined,
                    email: undefined,
                    phone: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(false);
            });
            it('should return true for isBusiness when type is \'company\'', () => {
                const theirDetails = new party_1.Party().deserialize({
                    type: 'company',
                    name: undefined,
                    email: undefined,
                    phone: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(true);
            });
        });
        describe('Check Properties', () => {
            it('should have title when input have title ', () => {
                const theirDetails = new party_1.Party().deserialize({
                    type: 'individual',
                    name: 'Mr. David Welcome',
                    email: undefined,
                    phone: undefined,
                    title: 'Mr.',
                    firstName: 'David',
                    lastName: 'Welcome'
                });
                chai_1.expect(theirDetails.title).to.equal('Mr.');
            });
            describe('Check Properties', () => {
                it('should have firstName when input have firstName ', () => {
                    const theirDetails = new party_1.Party().deserialize({
                        type: 'individual',
                        name: 'Mr. David Welcome',
                        email: undefined,
                        phone: undefined,
                        title: 'Mr.',
                        firstName: 'David',
                        lastName: 'Welcome'
                    });
                    chai_1.expect(theirDetails.firstName).to.equal('David');
                });
            });
            describe('Check Properties', () => {
                it('should have lastName when input have lastName ', () => {
                    const theirDetails = new party_1.Party().deserialize({
                        type: 'individual',
                        name: 'Mr. David Welcome',
                        email: undefined,
                        phone: undefined,
                        title: 'Mr.',
                        firstName: 'David',
                        lastName: 'Welcome'
                    });
                    chai_1.expect(theirDetails.lastName).to.equal('Welcome');
                });
            });
            describe('Check Properties', () => {
                it('should have lastName when input have lastName ', () => {
                    const theirDetails = new party_1.Party().deserialize({
                        type: 'individual',
                        name: 'Mr. David Welcome',
                        email: undefined,
                        phone: undefined,
                        title: 'Mr.',
                        firstName: 'David',
                        lastName: 'Welcome'
                    });
                    chai_1.expect(theirDetails.lastName).to.equal('Welcome');
                });
            });
            describe('Check Properties', () => {
                it('should have email when input have email ', () => {
                    const theirDetails = new party_1.Party().deserialize({
                        type: 'individual',
                        name: 'Mr. David Welcome',
                        email: 'david@gmail.com',
                        phone: undefined,
                        title: 'Mr.',
                        firstName: 'David',
                        lastName: 'Welcome'
                    });
                    chai_1.expect(theirDetails.email).to.equal('david@gmail.com');
                });
            });
            describe('Check Properties', () => {
                it('should have phone when input have phone ', () => {
                    const theirDetails = new party_1.Party().deserialize({
                        type: 'individual',
                        name: 'Mr. David Welcome',
                        email: undefined,
                        phone: '8768768768',
                        title: 'Mr.',
                        firstName: 'David',
                        lastName: 'Welcome'
                    });
                    chai_1.expect(theirDetails.phone).to.equal('8768768768');
                });
            });
        });
    });
});
