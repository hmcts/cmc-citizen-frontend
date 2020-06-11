"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const freeMediationUtil_1 = require("shared/utils/freeMediationUtil");
const freeMediation_1 = require("forms/models/freeMediation");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const claimStoreServiceMock = require("../../http-mocks/claim-store");
const claim_1 = require("claims/models/claim");
const responseDraft_1 = require("response/draft/responseDraft");
const responseDraft_2 = require("test/data/draft/responseDraft");
const featureToggles_1 = require("utils/featureToggles");
describe('FreeMediationUtil', () => {
    context('convertFreeMediation should return expected FreeMediation when', () => {
        it('getFreeMediation value is provided', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                youCanOnlyUseMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            const expectedValue = yesNoOption_1.YesNoOption.YES;
            chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getFreeMediation(draft)).to.deep.equal(expectedValue, 'Yes is expected');
        });
        if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            it('value is not provided', () => {
                const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
                const draft = new mediationDraft_1.MediationDraft().deserialize({
                    externalId: myExternalId,
                    youCanOnlyUseMediation: undefined
                });
                const expectedValue = yesNoOption_1.YesNoOption.NO;
                chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getFreeMediation(draft)).to.deep.equal(expectedValue, 'No is expected');
            });
        }
    });
    context('getMediationPhoneNumber should return expected value when', () => {
        it('company and they say yes to can we use', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                youCanOnlyUseMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                canWeUseCompany: {
                    option: freeMediation_1.FreeMediationOption.YES,
                    mediationPhoneNumberConfirmation: '07777777788',
                    mediationContactPerson: 'Mary Richards'
                },
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            const expectedValue = '07777777788';
            const claim = new claim_1.Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj);
            chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue);
        });
        it('company and they say no to can we use', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                youCanOnlyUseMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                canWeUseCompany: {
                    option: freeMediation_1.FreeMediationOption.NO,
                    mediationPhoneNumber: '07777777788',
                    mediationContactPerson: 'Mary Richards'
                },
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            const expectedValue = '07777777788';
            const claim = new claim_1.Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj);
            chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue);
        });
        it('individual and they say no to can we use', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                youCanOnlyUseMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                canWeUse: {
                    option: freeMediation_1.FreeMediationOption.NO,
                    mediationPhoneNumber: '07777777799'
                },
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            const expectedValue = '07777777799';
            const claim = new claim_1.Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj);
            chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue);
        });
        it('getMediationPhoneNumber when individual and they say yes to can we use', () => {
            const myExternalId = 'b17af4d2-273f-4999-9895-bce382fa24c8';
            const responseDraft = new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft);
            const draft = new mediationDraft_1.MediationDraft().deserialize({
                externalId: myExternalId,
                youCanOnlyUseMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                canWeUse: {
                    option: freeMediation_1.FreeMediationOption.YES
                },
                willYouTryMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            const expectedValue = '0700000000';
            const claim = new claim_1.Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj);
            chai_1.expect(freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, draft, responseDraft)).to.be.deep.eq(expectedValue);
        });
    });
});
