"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const freeMediationTask_1 = require("shared/components/free-mediation/freeMediationTask");
const freeMediation_1 = require("forms/models/freeMediation");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const CanWeUse_1 = require("mediation/form/models/CanWeUse");
const CanWeUseCompany_1 = require("mediation/form/models/CanWeUseCompany");
const claim_1 = require("claims/models/claim");
const claimStoreMock = require("../../../http-mocks/claim-store");
const featureToggles_1 = require("utils/featureToggles");
describe('Free mediation task', () => {
    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
    it('should not be completed when free mediation object is undefined', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = undefined;
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.false;
    });
    if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
        it('should not be completed when willYouTryMediation is yes and youCanOnlyUseMediation is undefined', () => {
            const mediationDraft = new mediationDraft_1.MediationDraft();
            mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
            mediationDraft.youCanOnlyUseMediation = undefined;
            chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.false;
        });
    }
    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is yes and canWeUse is yes', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUse = new CanWeUse_1.CanWeUse(freeMediation_1.FreeMediationOption.YES);
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true;
    });
    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is no', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.NO);
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true;
    });
    it('should be completed when willYouTryMediation is yes and youCanOnlyUseMediation is Yes and can we use is no and phone number is provided', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUse = new CanWeUse_1.CanWeUse(freeMediation_1.FreeMediationOption.NO, '07777777777');
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true;
    });
    it('should be completed when WeCanUseCompany is yes and phone number confirmation is provided', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUseCompany = new CanWeUseCompany_1.CanWeUseCompany(freeMediation_1.FreeMediationOption.YES, '', '', '07777777777');
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true;
    });
    it('should be completed when WeCanUseCompany is no and phone number and contact person is provided', () => {
        const mediationDraft = new mediationDraft_1.MediationDraft();
        mediationDraft.willYouTryMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        mediationDraft.canWeUseCompany = new CanWeUseCompany_1.CanWeUseCompany(freeMediation_1.FreeMediationOption.YES, '07777777777', 'Mary Richards', '');
        chai_1.expect(freeMediationTask_1.FreeMediationTask.isCompleted(mediationDraft, claim)).to.be.true;
    });
});
