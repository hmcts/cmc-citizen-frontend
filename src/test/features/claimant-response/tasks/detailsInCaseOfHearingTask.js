"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const detailsInCaseOfHearingTask_1 = require("claimant-response/tasks/detailsInCaseOfHearingTask");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const selfWitness_1 = require("directions-questionnaire/forms/models/selfWitness");
const expertRequired_1 = require("directions-questionnaire/forms/models/expertRequired");
const expertReports_1 = require("directions-questionnaire/forms/models/expertReports");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const otherWitnesses_1 = require("directions-questionnaire/forms/models/otherWitnesses");
const availability_1 = require("directions-questionnaire/forms/models/availability");
const supportRequired_1 = require("directions-questionnaire/forms/models/supportRequired");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const exceptionalCircumstances_1 = require("directions-questionnaire/forms/models/exceptionalCircumstances");
const claim_1 = require("claims/models/claim");
const claimStoreMock = require("../../../http-mocks/claim-store");
describe('Details In case of hearing task', () => {
    it('should not be completed when all directions questionnaire are not filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when hearing location is not defined', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation = undefined;
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when hearing location is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when only hearing location and exceptional circumstances are selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when only hearing location and self witness filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when expert reports are not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when expert report yes and no experts', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({
            declared: { options: 'yes' },
            rows: []
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when permission for expert is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({
            declared: { option: 'no' },
            rows: []
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when export evidence is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when export evidence is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when `why expert is needed` is not selected and expertEvidence option is no', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'no' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when `why expert is needed` is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when availability is not selected', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize({ explanation: 'report document' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when other support is selected but not filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize({ explanation: 'report document' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        directionsQuestionnaireDraft.availability = new availability_1.Availability().deserialize({
            hasUnavailableDates: false,
            unavailableDates: []
        });
        directionsQuestionnaireDraft.supportRequired = new supportRequired_1.SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: ''
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when language selected is selected but not filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize({ explanation: 'report document' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        directionsQuestionnaireDraft.availability = new availability_1.Availability().deserialize({
            hasUnavailableDates: false,
            unavailableDates: []
        });
        directionsQuestionnaireDraft.supportRequired = new supportRequired_1.SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: 'supporting documents',
            languageSelected: true,
            languageInterpreted: ''
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should not be completed when signLanguage selected is selected but not filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'yes' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize({ explanation: 'report document' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        directionsQuestionnaireDraft.availability = new availability_1.Availability().deserialize({
            hasUnavailableDates: false,
            unavailableDates: []
        });
        directionsQuestionnaireDraft.supportRequired = new supportRequired_1.SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: 'supporting documents',
            languageSelected: true,
            languageInterpreted: 'language documents',
            signLanguageSelected: true,
            signLanguageInterpreted: ''
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false;
    });
    it('should be completed when expert required and all other fields are filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertReports = new expertReports_1.ExpertReports().deserialize({ declared: { option: 'no' }, rows: [] });
        directionsQuestionnaireDraft.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize({ option: { option: 'no' } });
        directionsQuestionnaireDraft.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize({
            expertEvidence: { option: 'yes' },
            whatToExamine: 'documents'
        });
        directionsQuestionnaireDraft.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize({ explanation: 'report document' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        directionsQuestionnaireDraft.availability = new availability_1.Availability().deserialize({
            hasUnavailableDates: false,
            unavailableDates: []
        });
        directionsQuestionnaireDraft.supportRequired = new supportRequired_1.SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: 'supporting documents',
            languageSelected: true,
            languageInterpreted: 'language documents',
            signLanguageSelected: true,
            signLanguageInterpreted: 'sign language documents '
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.true;
    });
    it('should be completed when expert is not required and all other fields are filled', () => {
        const draft = new draftClaimantResponse_1.DraftClaimantResponse();
        const directionsQuestionnaireDraft = new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] }));
        directionsQuestionnaireDraft.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize({
            exceptionalCircumstances: { option: 'no' },
            reason: 'No Disable Access'
        });
        directionsQuestionnaireDraft.hearingLocation.courtName = 'London';
        directionsQuestionnaireDraft.selfWitness = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
        directionsQuestionnaireDraft.expertRequired = new expertRequired_1.ExpertRequired().deserialize({ option: 'no' });
        directionsQuestionnaireDraft.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize({
            otherWitnesses: { option: 'yes' },
            howMany: 1
        });
        directionsQuestionnaireDraft.availability = new availability_1.Availability().deserialize({
            hasUnavailableDates: false,
            unavailableDates: []
        });
        directionsQuestionnaireDraft.supportRequired = new supportRequired_1.SupportRequired().deserialize({
            otherSupportSelected: true,
            otherSupport: 'supporting documents',
            languageSelected: true,
            languageInterpreted: 'language documents',
            signLanguageSelected: true,
            signLanguageInterpreted: 'sign language documents '
        });
        chai_1.expect(detailsInCaseOfHearingTask_1.DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.true;
    });
});
