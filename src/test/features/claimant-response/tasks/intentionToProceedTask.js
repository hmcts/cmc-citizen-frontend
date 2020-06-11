"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const intentionToProceedTask_1 = require("claimant-response/tasks/intentionToProceedTask");
const intentionToProceed_1 = require("claimant-response/form/models/intentionToProceed");
const yesNoOption_1 = require("models/yesNoOption");
describe('IntentionToProceedTask', () => {
    it('should not be completed when object is undefined', () => {
        chai_1.expect(intentionToProceedTask_1.IntentionToProceedTask.isCompleted(undefined)).to.be.false;
    });
    it('should not be completed when option is not selected', () => {
        chai_1.expect(intentionToProceedTask_1.IntentionToProceedTask.isCompleted(new intentionToProceed_1.IntentionToProceed(undefined))).to.be.false;
    });
    it('should be completed when option is Yes', () => {
        chai_1.expect(intentionToProceedTask_1.IntentionToProceedTask.isCompleted(new intentionToProceed_1.IntentionToProceed(yesNoOption_1.YesNoOption.YES))).to.be.true;
    });
    it('should be completed when option is No', () => {
        chai_1.expect(intentionToProceedTask_1.IntentionToProceedTask.isCompleted(new intentionToProceed_1.IntentionToProceed(yesNoOption_1.YesNoOption.NO))).to.be.true;
    });
});
