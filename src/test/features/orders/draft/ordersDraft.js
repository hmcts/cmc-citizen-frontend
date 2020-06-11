"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ordersDraft_1 = require("orders/draft/ordersDraft");
describe('OrdersDraft', () => {
    describe('deserialization', () => {
        it('should return an OrdersDraft instance initialised with defaults for undefined', () => {
            chai_1.expect(new ordersDraft_1.OrdersDraft().deserialize(undefined)).to.eql(new ordersDraft_1.OrdersDraft());
        });
        it('should return a OrdersDraft instance initialised with defaults for null', () => {
            chai_1.expect(new ordersDraft_1.OrdersDraft().deserialize(null)).to.eql(new ordersDraft_1.OrdersDraft());
        });
        it('should return a ResponseDraft instance initialised with valid data (order)', () => {
            const draft = new ordersDraft_1.OrdersDraft().deserialize({
                disagreeReason: {
                    reason: 'I want a judge to review the order'
                }
            });
            chai_1.expect(draft.disagreeReason.reason).to.eql('I want a judge to review the order');
        });
    });
});
