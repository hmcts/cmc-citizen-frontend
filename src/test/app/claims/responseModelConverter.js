"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const responseModelConverter_1 = require("claims/responseModelConverter");
const responseDraft_1 = require("response/draft/responseDraft");
const responseDraft_2 = require("test/data/draft/responseDraft");
const partyDetails_1 = require("test/data/draft/partyDetails");
const response_1 = require("claims/models/response");
const responseData_1 = require("test/data/entity/responseData");
const party_1 = require("test/data/entity/party");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const claim_1 = require("claims/models/claim");
const claimStoreMock = require("test/http-mocks/claim-store");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const draft_store_1 = require("test/http-mocks/draft-store");
const featureToggles_1 = require("utils/featureToggles");
const freeMediation_1 = require("forms/models/freeMediation");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const hearingLocation_1 = require("claims/models/directions-questionnaire/hearingLocation");
function prepareResponseDraft(draftTemplate, partyDetails) {
    return new responseDraft_1.ResponseDraft().deserialize(Object.assign(Object.assign({}, draftTemplate), { defendantDetails: Object.assign(Object.assign({}, draftTemplate.defendantDetails), { partyDetails: partyDetails }), timeline: defendantTimeline_1.DefendantTimeline.fromObject({ rows: [], comment: 'I do not agree' }) }));
}
function prepareResponseData(template, party) {
    return response_1.Response.deserialize(Object.assign(Object.assign({}, template), { defendant: Object.assign(Object.assign({}, party), { email: 'user@example.com', phone: '0700000000' }), timeline: { rows: [], comment: 'I do not agree' } }));
}
function preparePartialResponseData(template, party) {
    return response_1.Response.deserialize(Object.assign(Object.assign({}, template), { defendant: Object.assign(Object.assign({}, party), { email: 'user@example.com', phone: '0700000000' }), timeline: template.timeline }));
}
function convertObjectLiteralToJSON(value) {
    return JSON.parse(JSON.stringify(value));
}
describe('ResponseModelConverter', () => {
    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleMediationDraftObj);
    const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(draft_store_1.sampleDirectionsQuestionnaireDraftObj);
    const directionsQuestionnaireResponseData = {
        directionsQuestionnaire: {
            witness: {
                noOfOtherWitness: 1,
                selfWitness: yesNoOption_1.YesNoOption.YES
            },
            requireSupport: {
                languageInterpreter: 'Klingon',
                signLanguageInterpreter: 'Makaton',
                hearingLoop: yesNoOption_1.YesNoOption.YES,
                disabledAccess: yesNoOption_1.YesNoOption.YES,
                otherSupport: 'Life advice'
            },
            hearingLocation: {
                courtName: 'Little Whinging, Surrey',
                locationOption: hearingLocation_1.CourtLocationType.SUGGESTED_COURT,
                exceptionalCircumstancesReason: 'Poorly pet owl',
                hearingLocationSlug: undefined,
                courtAddress: undefined
            },
            unavailableDates: [
                {
                    unavailableDate: '2020-01-04'
                },
                {
                    unavailableDate: '2020-02-08'
                }
            ],
            expertReports: [
                {
                    expertName: 'Prof. McGonagall',
                    expertReportDate: '2018-01-10'
                },
                {
                    expertName: 'Mr Rubeus Hagrid',
                    expertReportDate: '2019-02-27'
                }
            ],
            expertRequired: 'yes',
            permissionForExpert: 'yes',
            expertRequest: {
                expertEvidenceToExamine: 'Photographs',
                reasonForExpertAdvice: 'for expert opinion'
            }
        }
    };
    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            context('full defence conversion', () => {
                [
                    [partyDetails_1.individualDetails, party_1.individual],
                    [partyDetails_1.soleTraderDetails, party_1.soleTrader],
                    [partyDetails_1.companyDetails, party_1.company],
                    [partyDetails_1.organisationDetails, party_1.organisation]
                ].forEach(([partyDetails, party]) => {
                    it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
                        const responseDraft = prepareResponseDraft(responseDraft_2.defenceWithDisputeDraft, partyDetails);
                        const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), directionsQuestionnaireResponseData), party);
                        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                        chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                    });
                    it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type} to partial admission`, () => {
                        const responseDraft = prepareResponseDraft(responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft, partyDetails);
                        const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence), directionsQuestionnaireResponseData), party);
                        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                        chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                            .to.deep.equal(response_1.Response.deserialize(responseData));
                    });
                });
                it('should not convert payment declaration for defence with dispute', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), { whenDidYouPay: {
                            date: {
                                year: 2017,
                                month: 12,
                                day: 31
                            },
                            text: 'I paid in cash'
                        } }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                });
            });
            context('full admission conversion', () => {
                it('should convert full admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithImmediatePaymentDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithImmediatePaymentData(), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid immediately with title, firstName and lastName', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualSplitNameDetails);
                    const responseData = prepareResponseData(Object.assign({}, responseData_1.fullAdmissionWithImmediatePaymentData()), party_1.individualDefendant);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithPaymentBySetDateDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithPaymentBySetDateData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithPaymentByInstalmentsData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
            context('partial admission conversion', () => {
                it('should convert already paid partial admission', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionAlreadyPaidDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithImmediatePaymentDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithImmediatePaymentData()), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithPaymentBySetDateDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), directionsQuestionnaireResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), directionsQuestionnaireResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize({}), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
        }
        if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            const mediationResponseData = {
                freeMediation: 'yes',
                mediationPhoneNumber: '07777777777',
                mediationContactPerson: 'Mary Richards'
            };
            context('full defence conversion', () => {
                [
                    [partyDetails_1.individualDetails, party_1.individual],
                    [partyDetails_1.soleTraderDetails, party_1.soleTrader],
                    [partyDetails_1.companyDetails, party_1.company],
                    [partyDetails_1.organisationDetails, party_1.organisation]
                ].forEach(([partyDetails, party]) => {
                    it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
                        const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), draft_store_1.sampleMediationDraftObj), partyDetails);
                        const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), mediationResponseData), directionsQuestionnaireResponseData), party);
                        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                        chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                    });
                    it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type} to partial admission`, () => {
                        const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft), draft_store_1.sampleMediationDraftObj), partyDetails);
                        const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence), mediationResponseData), directionsQuestionnaireResponseData), party);
                        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                        chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                            .to.deep.equal(response_1.Response.deserialize(responseData));
                    });
                });
                it(`should convert company who says YES to mediation and confirm number`, () => {
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        youCanOnlyUseMediation: {
                            option: freeMediation_1.FreeMediationOption.YES
                        },
                        canWeUseCompany: {
                            option: freeMediation_1.FreeMediationOption.YES,
                            mediationPhoneNumberConfirmation: '07777777788',
                            mediationContactPerson: 'Mary Richards'
                        }
                    });
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft), partyDetails_1.companyDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence), {
                        freeMediation: 'yes',
                        mediationPhoneNumber: '07777777788',
                        mediationContactPerson: 'Company Smith'
                    }), directionsQuestionnaireResponseData), party_1.company);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(response_1.Response.deserialize(responseData));
                });
                it('should not convert payment declaration for defence with dispute', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), draft_store_1.sampleMediationDraftObj), { whenDidYouPay: {
                            date: {
                                year: 2017,
                                month: 12,
                                day: 31
                            },
                            text: 'I paid in cash'
                        } }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), mediationResponseData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                });
            });
            context('full admission conversion', () => {
                it('should convert full admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithImmediatePaymentData()), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid immediately with title, firstName and lastName', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualSplitNameDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithImmediatePaymentData()), mediationResponseData), party_1.individualDefendant);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
            context('partial admission conversion', () => {
                it('should convert already paid partial admission', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionAlreadyPaidDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), mediationResponseData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithImmediatePaymentData()), mediationResponseData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), mediationResponseData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), mediationResponseData), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), directionsQuestionnaireResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission with Mediation canWeUse FreeMediation to NO', () => {
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), {
                        freeMediation: 'no',
                        mediationPhoneNumber: '07777777799'
                    }), directionsQuestionnaireResponseData), party_1.individual);
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        canWeUse: {
                            option: freeMediation_1.FreeMediationOption.NO,
                            mediationPhoneNumber: '07777777799'
                        }
                    });
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission with Mediation canWeUse FreeMediation to YES and response not submitted', () => {
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), {
                        freeMediation: 'no',
                        mediationContactPerson: undefined,
                        mediationPhoneNumber: '0700000000'
                    }), directionsQuestionnaireResponseData), party_1.individual);
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        canWeUse: {
                            option: freeMediation_1.FreeMediationOption.YES
                        }
                    });
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
        }
    }
    if (!featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
        if (!featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            context('full defence conversion', () => {
                [
                    [partyDetails_1.individualDetails, party_1.individual],
                    [partyDetails_1.soleTraderDetails, party_1.soleTrader],
                    [partyDetails_1.companyDetails, party_1.company],
                    [partyDetails_1.organisationDetails, party_1.organisation]
                ].forEach(([partyDetails, party]) => {
                    it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
                        const responseDraft = prepareResponseDraft(responseDraft_2.defenceWithDisputeDraft, partyDetails);
                        const responseData = prepareResponseData(responseData_1.defenceWithDisputeData, party);
                        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                        chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                    });
                    it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type} to partial admission`, () => {
                        const responseDraft = prepareResponseDraft(responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft, partyDetails);
                        const responseData = preparePartialResponseData(responseData_1.partialAdmissionFromStatesPaidDefence, party);
                        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                        chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                            .to.deep.equal(response_1.Response.deserialize(responseData));
                    });
                });
                it('should not convert payment declaration for defence with dispute', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), { whenDidYouPay: {
                            date: {
                                year: 2017,
                                month: 12,
                                day: 31
                            },
                            text: 'I paid in cash'
                        } }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.defenceWithDisputeData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                });
            });
            context('full admission conversion', () => {
                it('should convert full admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithImmediatePaymentDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithImmediatePaymentData(), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid immediately with title, firstname and lastname', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithImmediatePaymentDraft, partyDetails_1.individualSplitNameDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithImmediatePaymentData(), party_1.individualDefendant);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithPaymentBySetDateDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithPaymentBySetDateData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft, partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(responseData_1.fullAdmissionWithPaymentByInstalmentsData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
            context('partial admission conversion', () => {
                it('should convert already paid partial admission', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionAlreadyPaidDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(responseData_1.partialAdmissionAlreadyPaidData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithImmediatePaymentDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(responseData_1.partialAdmissionWithImmediatePaymentData(), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithPaymentBySetDateDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(responseData_1.partialAdmissionWithPaymentBySetDateData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(responseData_1.partialAdmissionWithPaymentByInstalmentsData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, new mediationDraft_1.MediationDraft().deserialize(draft_store_1.sampleLegacyMediationDraftObj), directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission already paid', () => {
                    const responseDraft = prepareResponseDraft(responseDraft_2.partialAdmissionAlreadyPaidDraft, partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(responseData_1.partialAdmissionAlreadyPaidData, party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, undefined, undefined, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
        }
        if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            const mediationResponseData = {
                freeMediation: 'yes',
                mediationPhoneNumber: '07777777777',
                mediationContactPerson: 'Mary Richards'
            };
            context('full defence conversion', () => {
                [
                    [partyDetails_1.individualDetails, party_1.individual],
                    [partyDetails_1.soleTraderDetails, party_1.soleTrader],
                    [partyDetails_1.companyDetails, party_1.company],
                    [partyDetails_1.organisationDetails, party_1.organisation]
                ].forEach(([partyDetails, party]) => {
                    it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
                        const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), draft_store_1.sampleMediationDraftObj), partyDetails);
                        const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), mediationResponseData), party);
                        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                        chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                    });
                    it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type} to partial admission`, () => {
                        const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft), draft_store_1.sampleMediationDraftObj), partyDetails);
                        const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence), mediationResponseData), party);
                        const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                        chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                            .to.deep.equal(response_1.Response.deserialize(responseData));
                    });
                });
                it(`should convert company who says YES to mediation and confirm number`, () => {
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        youCanOnlyUseMediation: {
                            option: freeMediation_1.FreeMediationOption.YES
                        },
                        canWeUseCompany: {
                            option: freeMediation_1.FreeMediationOption.YES,
                            mediationPhoneNumberConfirmation: '07777777788',
                            mediationContactPerson: 'Mary Richards'
                        }
                    });
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.defenceWithAmountClaimedAlreadyPaidDraft), partyDetails_1.companyDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionFromStatesPaidDefence), {
                        freeMediation: 'yes',
                        mediationPhoneNumber: '07777777788',
                        mediationContactPerson: 'Company Smith'
                    }), party_1.company);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(response_1.Response.deserialize(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(response_1.Response.deserialize(responseData));
                });
                it('should not convert payment declaration for defence with dispute', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.defenceWithDisputeDraft), draft_store_1.sampleMediationDraftObj), { whenDidYouPay: {
                            date: {
                                year: 2017,
                                month: 12,
                                day: 31
                            },
                            text: 'I paid in cash'
                        } }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)).to.deep.equal(responseData);
                });
            });
            context('full admission conversion', () => {
                it('should convert full admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithImmediatePaymentData()), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission with title, firstName and lastName', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualSplitNameDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithImmediatePaymentData()), mediationResponseData), party_1.individualDefendant);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentBySetDateDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert full admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = prepareResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.fullAdmissionWithPaymentByInstalmentsData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
            context('partial admission conversion', () => {
                it('should convert already paid partial admission', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionAlreadyPaidDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid immediately', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithImmediatePaymentDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithImmediatePaymentData()), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by set date with mandatory SoM only', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentBySetDateDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithMandatoryFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), mediationResponseData), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission paid by instalments with complete SoM', () => {
                    const responseDraft = prepareResponseDraft(Object.assign(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), draft_store_1.sampleMediationDraftObj), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), mediationResponseData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithAllFieldsData) }), party_1.individual);
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission with Mediation canWeUse FreeMediation to NO', () => {
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), {
                        freeMediation: 'no',
                        mediationPhoneNumber: '07777777799'
                    }), party_1.individual);
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        canWeUse: {
                            option: freeMediation_1.FreeMediationOption.NO,
                            mediationPhoneNumber: '07777777799'
                        }
                    });
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
                it('should convert partial admission with Mediation canWeUse FreeMediation to YES and response not submitted', () => {
                    const responseDraft = prepareResponseDraft(Object.assign({}, responseDraft_2.partialAdmissionWithPaymentByInstalmentsDraft), partyDetails_1.individualDetails);
                    const responseData = preparePartialResponseData(Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), {
                        freeMediation: 'no',
                        mediationContactPerson: undefined,
                        mediationPhoneNumber: '0700000000'
                    }), party_1.individual);
                    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                        canWeUse: {
                            option: freeMediation_1.FreeMediationOption.YES
                        }
                    });
                    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
                    chai_1.expect(convertObjectLiteralToJSON(responseModelConverter_1.ResponseModelConverter.convert(responseDraft, mediationDraft, directionsQuestionnaireDraft, claim)))
                        .to.deep.equal(convertObjectLiteralToJSON(responseData));
                });
            });
        }
    }
});
