"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hearingLocation_1 = require("claims/models/directions-questionnaire/hearingLocation");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const localDate_1 = require("forms/models/localDate");
var DirectionsQuestionnaire;
(function (DirectionsQuestionnaire) {
    function deserialize(directionsQuestionnaire) {
        if (!directionsQuestionnaire) {
            return undefined;
        }
        return {
            requireSupport: directionsQuestionnaire.supportRequired && {
                languageInterpreter: directionsQuestionnaire.supportRequired.languageInterpreted,
                signLanguageInterpreter: directionsQuestionnaire.supportRequired.signLanguageInterpreted,
                hearingLoop: directionsQuestionnaire.supportRequired.hearingLoopSelected ? yesNoOption_1.YesNoOption.YES : yesNoOption_1.YesNoOption.NO,
                disabledAccess: directionsQuestionnaire.supportRequired.disabledAccessSelected ? yesNoOption_1.YesNoOption.YES : yesNoOption_1.YesNoOption.NO,
                otherSupport: directionsQuestionnaire.supportRequired.otherSupport
            },
            hearingLocation: toHearingLocation(directionsQuestionnaire),
            witness: directionsQuestionnaire.selfWitness && {
                selfWitness: directionsQuestionnaire.selfWitness.option.option,
                noOfOtherWitness: directionsQuestionnaire.otherWitnesses ? directionsQuestionnaire.otherWitnesses.howMany : undefined
            },
            expertReports: (directionsQuestionnaire.expertReports && directionsQuestionnaire.expertReports.rows.length > 0) ?
                directionsQuestionnaire.expertReports.rows.map(row => ({
                    expertName: row.expertName,
                    expertReportDate: row.reportDate ? localDate_1.LocalDate.fromObject(row.reportDate).asString() : undefined
                })) : undefined,
            unavailableDates: directionsQuestionnaire.availability &&
                directionsQuestionnaire.availability.unavailableDates.map(unavailableDate => ({
                    unavailableDate: unavailableDate ? localDate_1.LocalDate.fromObject(unavailableDate).asString() : undefined
                })),
            expertRequired: directionsQuestionnaire.expertRequired.option.option,
            permissionForExpert: directionsQuestionnaire.permissionForExpert &&
                directionsQuestionnaire.permissionForExpert.option ?
                directionsQuestionnaire.permissionForExpert.option.option : undefined,
            expertRequest: (directionsQuestionnaire.expertEvidence.expertEvidence &&
                directionsQuestionnaire.expertEvidence.expertEvidence.option === yesNoOption_1.YesNoOption.YES) ? {
                expertEvidenceToExamine: directionsQuestionnaire.expertEvidence.whatToExamine,
                reasonForExpertAdvice: directionsQuestionnaire.whyExpertIsNeeded.explanation
            } : undefined
        };
    }
    DirectionsQuestionnaire.deserialize = deserialize;
    function toHearingLocation(directionsQuestionnaire) {
        if (directionsQuestionnaire.hearingLocation.courtName === undefined &&
            directionsQuestionnaire.hearingLocation.alternativeCourtName === undefined) {
            return undefined;
        }
        return {
            courtName: directionsQuestionnaire.hearingLocation &&
                directionsQuestionnaire.hearingLocation.courtAccepted &&
                directionsQuestionnaire.hearingLocation.courtAccepted.option === yesNoOption_1.YesNoOption.YES ?
                directionsQuestionnaire.hearingLocation.courtName : directionsQuestionnaire.hearingLocation.alternativeCourtName,
            hearingLocationSlug: (directionsQuestionnaire.hearingLocationSlug && directionsQuestionnaire.hearingLocationSlug.length) ? directionsQuestionnaire.hearingLocationSlug : undefined,
            courtAddress: undefined,
            locationOption: directionsQuestionnaire.hearingLocation &&
                directionsQuestionnaire.hearingLocation.alternativeCourtName &&
                directionsQuestionnaire.hearingLocation.alternativeCourtName.length ?
                hearingLocation_1.CourtLocationType.ALTERNATE_COURT : hearingLocation_1.CourtLocationType.SUGGESTED_COURT,
            exceptionalCircumstancesReason: directionsQuestionnaire.exceptionalCircumstances ?
                directionsQuestionnaire.exceptionalCircumstances.reason : undefined
        };
    }
    function fromObject(directionsQuestionnaire) {
        if (!directionsQuestionnaire) {
            return undefined;
        }
        return directionsQuestionnaire;
    }
    DirectionsQuestionnaire.fromObject = fromObject;
})(DirectionsQuestionnaire = exports.DirectionsQuestionnaire || (exports.DirectionsQuestionnaire = {}));
