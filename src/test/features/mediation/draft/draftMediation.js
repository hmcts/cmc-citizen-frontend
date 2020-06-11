"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mediationDraft_1 = require("main/features/mediation/draft/mediationDraft");
const freeMediation_1 = require("forms/models/freeMediation");
describe('MediationDraft', () => {
    describe('deserialization', () => {
        it('should return a DraftMediation instance initialised with defaults for undefined', () => {
            chai_1.expect(new mediationDraft_1.MediationDraft().deserialize(undefined)).to.eql(new mediationDraft_1.MediationDraft());
        });
        it('should return a DraftMediation instance initialised with defaults for null', () => {
            chai_1.expect(new mediationDraft_1.MediationDraft().deserialize(null)).to.eql(new mediationDraft_1.MediationDraft());
        });
        it('should return a DraftMediation instance initialised with valid data', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            chai_1.expect(draft.externalId).to.eql(myExternalId);
            chai_1.expect(draft.willYouTryMediation.option).to.eql(freeMediation_1.FreeMediationOption.YES);
        });
    });
});
