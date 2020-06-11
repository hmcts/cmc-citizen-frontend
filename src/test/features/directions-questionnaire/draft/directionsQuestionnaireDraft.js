"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const draft_store_1 = require("test/http-mocks/draft-store");
describe('DirectionsQuestionnaireDraft', () => {
    describe('deserialization', () => {
        const directionsQuestionnaireDraftSampleData = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(draft_store_1.sampleDirectionsQuestionnaireDraftObj);
        it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for undefined', () => {
            chai_1.expect(new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(undefined)).to.eql(new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
        });
        it('should return a DirectionsQuestionnaireDraft instance initialised with defaults for null', () => {
            chai_1.expect(new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(null)).to.eql(new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
        });
        it('should return a DirectionsQuestionnaireDraft instance initialised with valid data', () => {
            chai_1.expect(directionsQuestionnaireDraftSampleData.selfWitness.option.option).to.equal('yes');
            chai_1.expect(directionsQuestionnaireDraftSampleData.otherWitnesses.otherWitnesses.option).to.equal('yes');
            chai_1.expect(directionsQuestionnaireDraftSampleData.otherWitnesses.howMany).to.equal(1);
            chai_1.expect(directionsQuestionnaireDraftSampleData.hearingLocation.courtName).to.equal('Little Whinging, Surrey');
            chai_1.expect(directionsQuestionnaireDraftSampleData.exceptionalCircumstances.exceptionalCircumstances.option).to.equal('yes');
            chai_1.expect(directionsQuestionnaireDraftSampleData.exceptionalCircumstances.reason).to.equal('Poorly pet owl');
            chai_1.expect(directionsQuestionnaireDraftSampleData.availability.hasUnavailableDates).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.availability.unavailableDates).to.have.deep.members([
                { year: 2020, month: 1, day: 4 },
                { year: 2020, month: 2, day: 8 }
            ]);
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.languageSelected).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.languageInterpreted).to.equal('Klingon');
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.signLanguageSelected).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.signLanguageInterpreted).to.equal('Makaton');
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.hearingLoopSelected).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.disabledAccessSelected).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.otherSupportSelected).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.supportRequired.otherSupport).to.equal('Life advice');
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertRequired.option.option).to.equal('yes');
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.declared).to.be.true;
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.rows).to.have.length(2);
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.rows[0].expertName).to.equal('Prof. McGonagall');
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.rows[0].reportDate).to.deep.equal({ year: 2018, month: 1, day: 10 });
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.rows[1].expertName).to.equal('Mr Rubeus Hagrid');
            chai_1.expect(directionsQuestionnaireDraftSampleData.expertReports.rows[1].reportDate).to.deep.equal({ year: 2019, month: 2, day: 27 });
        });
    });
});
