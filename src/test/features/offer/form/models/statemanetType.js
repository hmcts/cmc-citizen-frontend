"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const statementType_1 = require("offer/form/models/statementType");
describe('StatementType', () => {
    describe('valueOf', () => {
        it('should return StatementType for valid input', () => {
            chai_1.expect(statementType_1.StatementType.valueOf(statementType_1.StatementType.ACCEPTATION.value)).to.be.equal(statementType_1.StatementType.ACCEPTATION);
        });
        it('should return undefined for invalid string', () => {
            chai_1.expect(statementType_1.StatementType.valueOf('Unknown type!!!')).to.be.equal(undefined);
        });
    });
});
