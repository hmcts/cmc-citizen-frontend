"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const address_1 = require("forms/models/address");
describe('Address', () => {
    describe('isCompleted', () => {
        it('should return true when there is a postcode', () => {
            const input = {
                line1: 'House no',
                line2: 'Another lane',
                line3: 'Another area',
                city: 'Manchester',
                postcode: 'BB12 7NQ'
            };
            const add = new address_1.Address().deserialize(input);
            chai_1.expect(add.isCompleted()).to.equal(true);
        });
        it('should return false when there is no postcode', () => {
            const add = new address_1.Address();
            chai_1.expect(add.isCompleted()).to.equal(false);
        });
        it('should return false when there is invalid postcode', () => {
            const input = {
                line1: 'House no',
                line2: 'Another lane',
                line3: 'Another area',
                city: 'Manchester',
                postcode: 'BB1234567'
            };
            const add = new address_1.Address().deserialize(input);
            chai_1.expect(add.isCompleted()).to.equal(false);
        });
    });
});
