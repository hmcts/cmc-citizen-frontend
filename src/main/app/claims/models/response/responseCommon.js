"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyType_1 = require("common/partyType");
const individual_1 = require("claims/models/details/yours/individual");
const soleTrader_1 = require("claims/models/details/yours/soleTrader");
const company_1 = require("claims/models/details/yours/company");
const organisation_1 = require("claims/models/details/yours/organisation");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
var ResponseCommon;
(function (ResponseCommon) {
    function deserialize(input) {
        return {
            responseType: input.responseType,
            responseMethod: input.responseMethod,
            defendant: deserializeDefendantDetails(input.defendant),
            freeMediation: input.freeMediation,
            mediationPhoneNumber: input.mediationPhoneNumber,
            mediationContactPerson: input.mediationContactPerson,
            statementOfTruth: input.statementOfTruth
                ? new statementOfTruth_1.StatementOfTruth().deserialize(input.statementOfTruth)
                : undefined
        };
    }
    ResponseCommon.deserialize = deserialize;
})(ResponseCommon = exports.ResponseCommon || (exports.ResponseCommon = {}));
function deserializeDefendantDetails(defendant) {
    if (defendant) {
        switch (defendant.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                return new individual_1.Individual().deserialize(defendant);
            case partyType_1.PartyType.COMPANY.value:
                return new company_1.Company().deserialize(defendant);
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                return new soleTrader_1.SoleTrader().deserialize(defendant);
            case partyType_1.PartyType.ORGANISATION.value:
                return new organisation_1.Organisation().deserialize(defendant);
            default:
                throw Error(`Unknown party type: ${defendant.type}`);
        }
    }
}
