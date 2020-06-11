"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const defence_1 = require("response/form/models/defence");
const yourDefenceTask_1 = require("response/tasks/yourDefenceTask");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const timelineRow_1 = require("forms/models/timelineRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const VALID_DEFENCE_TEXT = 'this is valid defence';
describe('Your defence task', () => {
    context('should not be completed when', () => {
        it('defence object is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.defence = undefined;
            draft.timeline = new defendantTimeline_1.DefendantTimeline();
            chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.false;
        });
        it('timeline object is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.defence = new defence_1.Defence(VALID_DEFENCE_TEXT);
            draft.timeline = undefined;
            chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.false;
        });
        it('defence text is invalid', () => {
            [undefined, '', ' '].forEach(defence => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.defence = new defence_1.Defence(defence);
                draft.timeline = new defendantTimeline_1.DefendantTimeline();
                chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.false;
            });
        });
        it('timelineRow is invalid', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.defence = new defence_1.Defence(VALID_DEFENCE_TEXT);
            draft.timeline = new defendantTimeline_1.DefendantTimeline([new timelineRow_1.TimelineRow('', 'invalid')]);
            chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.false;
        });
        it('timeline comment is too long', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.defence = new defence_1.Defence(VALID_DEFENCE_TEXT);
            draft.timeline = new defendantTimeline_1.DefendantTimeline([new timelineRow_1.TimelineRow('a', 'valid')], validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1));
            chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.false;
        });
    });
    context('should be completed when', () => {
        it('both defence and timeline are valid', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.defence = new defence_1.Defence(VALID_DEFENCE_TEXT);
            draft.timeline = new defendantTimeline_1.DefendantTimeline([new timelineRow_1.TimelineRow('valid date', 'valid description')], 'valid comment');
            chai_1.expect(yourDefenceTask_1.YourDefenceTask.isCompleted(draft)).to.be.true;
        });
    });
});
