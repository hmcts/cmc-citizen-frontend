"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const responseType_1 = require("response/form/models/responseType");
describe('ResponseType', () => {
    describe('valueOf', () => {
        it('should return ResponseType for corresponding value', () => {
            chai_1.expect(responseType_1.ResponseType.valueOf(responseType_1.ResponseType.FULL_ADMISSION.value)).to.be.eq(responseType_1.ResponseType.FULL_ADMISSION);
            chai_1.expect(responseType_1.ResponseType.valueOf(responseType_1.ResponseType.DEFENCE.value)).to.be.eq(responseType_1.ResponseType.DEFENCE);
            chai_1.expect(responseType_1.ResponseType.valueOf(responseType_1.ResponseType.PART_ADMISSION.value)).to.be.eq(responseType_1.ResponseType.PART_ADMISSION);
        });
        it('should return undefined for incorrect value', () => {
            chai_1.expect(responseType_1.ResponseType.valueOf('I do not exist')).to.be.eq(undefined);
        });
    });
});
