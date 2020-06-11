"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theirDetails_1 = require("claims/models/details/theirs/theirDetails");
const chai_1 = require("chai");
describe('TheirData', () => {
    describe('deserialize', () => {
        describe('isBusiness', () => {
            it('should return false for isBusiness when type is \'individual\'', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'individual',
                    name: undefined,
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(false);
            });
            it('should return false for isBusiness when type is \'soleTrader\'', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'soleTrader',
                    name: undefined,
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(false);
            });
            it('should return true for isBusiness when type is \'company\'', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'company',
                    name: undefined,
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(true);
            });
            it('should return true for isBusiness when type is \'organisation\'', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'organisation',
                    name: undefined,
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.isBusiness()).to.equal(true);
            });
        });
        describe('isSplitNameAvailable', () => {
            it('should return firstName for Individual when firstName provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'individual',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.firstName).to.equal('testFirstName');
            });
            it('should return lastName for Individual when lastName provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'individual',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.lastName).to.equal('testLastName');
            });
            it('should return title for Individual when title provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'individual',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.title).to.equal('testTitle');
            });
            it('should return firstName for SoleTrader when firstName provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'soleTrader',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.firstName).to.equal('testFirstName');
            });
            it('should return lastName for SoleTrader when lastName provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'soleTrader',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.lastName).to.equal('testLastName');
            });
            it('should return title for SoleTrader when title provided', () => {
                const theirDetails = new theirDetails_1.TheirDetails().deserialize({
                    type: 'soleTrader',
                    name: undefined,
                    title: 'testTitle',
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    address: undefined,
                    email: undefined
                });
                chai_1.expect(theirDetails.title).to.equal('testTitle');
            });
        });
    });
});
