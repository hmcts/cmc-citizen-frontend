"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const selfWitness_1 = require("directions-questionnaire/forms/models/selfWitness");
const otherWitnesses_1 = require("directions-questionnaire/forms/models/otherWitnesses");
const exceptionalCircumstances_1 = require("directions-questionnaire/forms/models/exceptionalCircumstances");
const availability_1 = require("directions-questionnaire/forms/models/availability");
const supportRequired_1 = require("directions-questionnaire/forms/models/supportRequired");
const expertRequired_1 = require("directions-questionnaire/forms/models/expertRequired");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
const expertReports_1 = require("directions-questionnaire/forms/models/expertReports");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
const hearingLocation_1 = require("directions-questionnaire/forms/models/hearingLocation");
class DirectionsQuestionnaireDraft extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super(...arguments);
        this.selfWitness = new selfWitness_1.SelfWitness();
        this.otherWitnesses = new otherWitnesses_1.OtherWitnesses();
        this.hearingLocation = new hearingLocation_1.HearingLocation();
        this.hearingLocationSlug = '';
        this.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances();
        this.availability = new availability_1.Availability();
        this.supportRequired = new supportRequired_1.SupportRequired();
        this.expertRequired = new expertRequired_1.ExpertRequired();
        this.expertReports = new expertReports_1.ExpertReports();
        this.permissionForExpert = new permissionForExpert_1.PermissionForExpert();
        this.expertEvidence = new expertEvidence_1.ExpertEvidence();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            this.selfWitness = new selfWitness_1.SelfWitness().deserialize(input.selfWitness.option);
            this.otherWitnesses = new otherWitnesses_1.OtherWitnesses().deserialize(input.otherWitnesses);
            this.supportRequired = new supportRequired_1.SupportRequired().deserialize(input.supportRequired);
            this.hearingLocation = new hearingLocation_1.HearingLocation().deserialize(input.hearingLocation);
            this.hearingLocationSlug = input.hearingLocationSlug;
            this.exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances().deserialize(input.exceptionalCircumstances);
            this.availability = new availability_1.Availability().deserialize(input.availability);
            this.expertRequired = new expertRequired_1.ExpertRequired().deserialize(input.expertRequired.option);
            this.expertReports = new expertReports_1.ExpertReports().deserialize(input.expertReports);
            this.permissionForExpert = new permissionForExpert_1.PermissionForExpert().deserialize(input.permissionForExpert);
            this.expertEvidence = new expertEvidence_1.ExpertEvidence().deserialize(input.expertEvidence);
            this.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded().deserialize(input.whyExpertIsNeeded);
        }
        return this;
    }
}
exports.DirectionsQuestionnaireDraft = DirectionsQuestionnaireDraft;
