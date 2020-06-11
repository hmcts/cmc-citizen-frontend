"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
const draft_store_1 = require("../../../../http-mocks/draft-store");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const hearingLocation_1 = require("claims/models/directions-questionnaire/hearingLocation");
describe('DirectionsQuestionnaire', () => {
    const expectedData = {
        requireSupport: {
            languageInterpreter: 'Klingon',
            signLanguageInterpreter: 'Makaton',
            hearingLoop: 'yes',
            disabledAccess: 'yes',
            otherSupport: 'Life advice'
        },
        hearingLocation: {
            courtName: 'Little Whinging, Surrey',
            hearingLocationSlug: undefined,
            courtAddress: undefined,
            locationOption: hearingLocation_1.CourtLocationType.SUGGESTED_COURT,
            exceptionalCircumstancesReason: 'Poorly pet owl'
        },
        witness: {
            selfWitness: 'yes',
            noOfOtherWitness: 1
        },
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
        unavailableDates: [
            { unavailableDate: '2020-01-04' },
            { unavailableDate: '2020-02-08' }
        ],
        expertRequired: 'yes',
        permissionForExpert: 'yes',
        expertRequest: {
            expertEvidenceToExamine: 'Photographs',
            reasonForExpertAdvice: 'for expert opinion'
        }
    };
    describe('deserialize', () => {
        it('should deserialize directions questionnaire', () => {
            const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(draft_store_1.sampleDirectionsQuestionnaireDraftObj);
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)).to.deep.equal(expectedData);
        });
        it('should deserialize directions questionnaire correctly when no expert reports and no expert evidence', () => {
            const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(Object.assign(Object.assign({}, draft_store_1.sampleDirectionsQuestionnaireDraftObj), {
                expertReports: {
                    declared: true,
                    rows: [{}]
                },
                expertEvidence: undefined
            }));
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData)).to.deep.equal(Object.assign(Object.assign({}, expectedData), {
                expertRequired: 'yes',
                expertReports: undefined,
                expertRequest: undefined
            }));
        });
        it('should deserialize undefined directions questionnaire and it should return undefined', () => {
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(undefined)).to.be.equal(undefined);
        });
        it('from object should return response object when we pass the dqs from backend', () => {
            const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(draft_store_1.sampleDirectionsQuestionnaireDraftObj);
            const directionsQuestionnaireResponseData = directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData);
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal(directionsQuestionnaireResponseData);
        });
        it('from object should return undefined when input is undefined', () => {
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(undefined)).to.be.equal(undefined);
        });
        it('deserialize object should return hearing location undefined when courtName or alternateCourtName is undefined.', () => {
            const sampleObj = Object.assign(Object.assign({}, draft_store_1.sampleDirectionsQuestionnaireDraftObj), { hearingLocation: {
                    courtName: undefined,
                    courtPostCode: undefined,
                    courtAccepted: undefined,
                    alternateCourtName: undefined
                } });
            const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(sampleObj);
            const directionsQuestionnaireResponseData = directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData);
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal(Object.assign(Object.assign({}, expectedData), {
                hearingLocation: undefined
            }));
        });
        it('deserialize object should return hearing location when alternateCourtName is provided.', () => {
            const sampleObj = Object.assign(Object.assign({}, draft_store_1.sampleDirectionsQuestionnaireDraftObj), { hearingLocation: {
                    alternativeCourtName: 'Little Whinging, Surrey',
                    hearingLocationSlug: undefined,
                    courtAddress: undefined,
                    exceptionalCircumstancesReason: 'Poorly pet owl'
                } });
            const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(sampleObj);
            const directionsQuestionnaireResponseData = directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraftSampleData);
            chai_1.expect(directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(directionsQuestionnaireResponseData)).to.deep.equal(Object.assign(Object.assign({}, expectedData), {
                hearingLocation: {
                    courtAddress: undefined,
                    courtName: 'Little Whinging, Surrey',
                    exceptionalCircumstancesReason: 'Poorly pet owl',
                    hearingLocationSlug: undefined,
                    locationOption: 'ALTERNATE_COURT'
                }
            }));
        });
    });
});
