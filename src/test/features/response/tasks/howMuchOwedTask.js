"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const howMuchOwedTask_1 = require("response/tasks/howMuchOwedTask");
describe('How much owed task', () => {
    it('should be true when amount and text is defined', () => {
        const input = {
            howMuchOwed: {
                amount: 300,
                text: 'I owe nothing'
            }
        };
        const responseDraft = new responseDraft_1.ResponseDraft().deserialize(input);
        chai_1.expect(howMuchOwedTask_1.HowMuchOwedTask.isCompleted(responseDraft)).to.equal(true);
    });
    it('should be false when text is empty', () => {
        const input = {
            howMuchOwed: {
                amount: 300,
                text: ''
            }
        };
        const responseDraft = new responseDraft_1.ResponseDraft().deserialize(input);
        chai_1.expect(howMuchOwedTask_1.HowMuchOwedTask.isCompleted(responseDraft)).to.equal(false);
    });
    it('should be undefined when amount is undefined', () => {
        const input = {
            howMuchOwed: {
                amount: undefined,
                text: 'I owe nothing'
            }
        };
        const responseDraft = new responseDraft_1.ResponseDraft().deserialize(input);
        chai_1.expect(howMuchOwedTask_1.HowMuchOwedTask.isCompleted(responseDraft)).to.equal(undefined);
    });
    it('should be undefined when amount is undefined and text is empty', () => {
        const input = {
            howMuchOwed: {
                amount: undefined,
                text: ''
            }
        };
        const responseDraft = new responseDraft_1.ResponseDraft().deserialize(input);
        chai_1.expect(howMuchOwedTask_1.HowMuchOwedTask.isCompleted(responseDraft)).to.equal(undefined);
    });
});
