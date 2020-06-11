"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draft_store_1 = require("test/http-mocks/draft-store");
const claim_1 = require("claims/models/claim");
const claim_store_1 = require("test/http-mocks/claim-store");
const ordersDraft_1 = require("orders/draft/ordersDraft");
const reviewOrder_1 = require("claims/models/reviewOrder");
const ordersConverter_1 = require("claims/ordersConverter");
const chai_1 = require("chai");
const madeBy_1 = require("claims/models/madeBy");
const user = {
    id: '1',
    bearerToken: 'SuperSecretToken'
};
describe('OrdersConverter', () => {
    it('should convert orders draft to Review Order instance', () => {
        const ordersDraft = new ordersDraft_1.OrdersDraft().deserialize(draft_store_1.sampleOrdersDraftObj);
        const claim = new claim_1.Claim().deserialize(claim_store_1.sampleClaimIssueObj);
        const reviewOrder = ordersConverter_1.OrdersConverter.convert(ordersDraft, claim, user);
        chai_1.expect(reviewOrder).to.be.instanceOf(reviewOrder_1.ReviewOrder);
    });
    it('should convert orders draft to Review Order', () => {
        const ordersDraft = new ordersDraft_1.OrdersDraft().deserialize(draft_store_1.sampleOrdersDraftObj);
        const claim = new claim_1.Claim().deserialize(claim_store_1.sampleClaimIssueObj);
        const reviewOrder = ordersConverter_1.OrdersConverter.convert(ordersDraft, claim, user);
        chai_1.expect(reviewOrder.reason).to.equal('I want a judge to review it');
        chai_1.expect(reviewOrder.requestedBy).to.equal(madeBy_1.MadeBy.CLAIMANT.value);
    });
});
