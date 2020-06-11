"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const partyType_1 = require("common/partyType");
describe('PartyType', () => {
    describe('valueOf', () => {
        it('should return undefined for unknown type', () => {
            chai_1.expect(partyType_1.PartyType.valueOf('unknown-type')).to.be.undefined;
        });
        it('should return type for known types', () => {
            partyType_1.PartyType.all().forEach(type => {
                chai_1.expect(partyType_1.PartyType.valueOf(type.value)).to.be.equal(type);
            });
        });
    });
});
