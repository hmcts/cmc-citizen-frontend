"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const freeMediationTask_1 = require("main/common/components/free-mediation/freeMediationTask");
const freeMediation_1 = require("forms/models/freeMediation");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const CanWeUse_1 = require("mediation/form/models/CanWeUse");
const CanWeUseCompany_1 = require("mediation/form/models/CanWeUseCompany");
describe('Free mediation task', () => {
    it('isWillYouTryMediationCompleted should not be completed when willYouTryMediation object is undefined', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = undefined;
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isWillYouTryMediationCompleted(mediationDraft)).to.be.false;
    });
    it('isWillYouTryMediationCompleted should be completed when willYouTryMediation object is ', () => {
        freeMediation_1.FreeMediationOption.all().forEach(option => {
            it(`${option}`, () => {
                const mediationDraft = new mediationDraft_1.MediationDraft();
                mediationDraft.willYouTryMediation.option = option;
                chai_1.expect(freeMediationTask_1.FreeMediationTask.isWillYouTryMediationCompleted(mediationDraft)).to.be.true;
            });
        });
    });
    it('isYouCanOnlyUseMediationCompleted should not be completed when youCanOnlyUseMediation object is undefined', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = undefined;
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isYouCanOnlyUseMediationCompleted(mediationDraft)).to.be.false;
    });
    it('isYouCanOnlyUseMediationCompleted should be completed when youCanOnlyUseMediation object is ', () => {
        freeMediation_1.FreeMediationOption.all().forEach(option => {
            it(`${option}`, () => {
                const mediationDraft = new mediationDraft_1.MediationDraft();
                mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
                mediationDraft.youCanOnlyUseMediation.option = option;
                chai_1.expect(freeMediationTask_1.FreeMediationTask.isYouCanOnlyUseMediationCompleted(mediationDraft)).to.be.true;
            });
        });
    });
    it('isCanWeUseCompleted should not be completed when canWeUse and canWeUseCompany object is undefined', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUse = undefined;
        mediationDraft.canWeUseCompany = undefined;
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.false;
    });
    it('isCanWeUseCompleted should be completed when canWeUse is set and canWeUseCompany object is undefined', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUse = new CanWeUse_1.CanWeUse(freeMediation_1.FreeMediationOption.NO, '07777777777');
        mediationDraft.canWeUseCompany = undefined;
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.true;
    });
    it('isCanWeUseCompleted should be completed when canWeUse is undefined and canWeUseCompany object is set', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUse = undefined;
        mediationDraft.canWeUseCompany = new CanWeUseCompany_1.CanWeUseCompany(freeMediation_1.FreeMediationOption.YES, '', '', '07777777777');
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCanWeUseCompleted(mediationDraft)).to.be.true;
    });
    it('isMediationDisagreementCompleted should be completed when willYouTryMediation is no and mediationDisagreement is no', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.NO);
        mediationDraft.mediationDisagreement = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.NO);
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isMediationDisagreementCompleted(mediationDraft)).to.be.true;
    });
});
