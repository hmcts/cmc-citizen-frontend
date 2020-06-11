"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const disability_1 = require("response/form/models/statement-of-means/disability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const partnerAge_1 = require("response/form/models/statement-of-means/partnerAge");
const validator = new class_validator_1.Validator();
function isValid(input) {
    return input !== undefined && validator.validateSync(input).length === 0;
}
class StatementOfMeansTask {
    static isCompleted(responseDraft) {
        const statementOfMeans = responseDraft.statementOfMeans;
        return statementOfMeans !== undefined
            && isValid(statementOfMeans.bankAccounts)
            && isValid(statementOfMeans.residence)
            && StatementOfMeansTask.isDependantsCompleted(statementOfMeans)
            && isValid(statementOfMeans.otherDependants)
            && StatementOfMeansTask.isEmploymentCompleted(statementOfMeans)
            && isValid(statementOfMeans.monthlyIncome)
            && isValid(statementOfMeans.monthlyExpenses)
            && isValid(statementOfMeans.debts)
            && isValid(statementOfMeans.courtOrders)
            && isValid(statementOfMeans.explanation)
            && StatementOfMeansTask.isDisabilityCompleted(statementOfMeans)
            && StatementOfMeansTask.isPartnerCompleted(statementOfMeans);
    }
    static isDependantsCompleted(statementOfMeans) {
        const valid = isValid(statementOfMeans.dependants);
        if (valid && statementOfMeans.dependants.declared && statementOfMeans.dependants.numberOfChildren.between16and19 > 0) {
            return isValid(statementOfMeans.education);
        }
        return valid;
    }
    static isEmploymentCompleted(statementOfMeans) {
        if (!isValid(statementOfMeans.employment)) {
            return false;
        }
        if (!statementOfMeans.employment.declared) {
            return isValid(statementOfMeans.unemployment);
        }
        let valid = true;
        if (statementOfMeans.employment.employed) {
            valid = valid && isValid(statementOfMeans.employers);
        }
        if (statementOfMeans.employment.selfEmployed) {
            valid = valid && isValid(statementOfMeans.selfEmployment) && isValid(statementOfMeans.onTaxPayments);
        }
        return valid;
    }
    static isDisabilityCompleted(statementOfMeans) {
        if (!isValid(statementOfMeans.disability)) {
            return false;
        }
        return statementOfMeans.disability.option === disability_1.DisabilityOption.NO || isValid(statementOfMeans.severeDisability);
    }
    static isPartnerCompleted(statementOfMeans) {
        if (!isValid(statementOfMeans.cohabiting)) {
            return false;
        }
        const hasPartner = statementOfMeans.cohabiting.option === cohabiting_1.CohabitingOption.YES;
        if (hasPartner) {
            if (!isValid(statementOfMeans.partnerAge)) {
                return false;
            }
            const partnerIsAdult = statementOfMeans.partnerAge.option === partnerAge_1.PartnerAgeOption.YES;
            if (partnerIsAdult && !isValid(statementOfMeans.partnerPension)) {
                return false;
            }
            const defendantIsDisabled = statementOfMeans.disability.option === disability_1.DisabilityOption.YES;
            const defendantIsSeverelyDisabled = defendantIsDisabled && statementOfMeans.severeDisability === severeDisability_1.SevereDisabilityOption.YES;
            if (defendantIsDisabled && !isValid(statementOfMeans.partnerDisability)) {
                return false;
            }
            const partnerIsDisabled = statementOfMeans.partnerDisability.option === partnerDisability_1.PartnerDisabilityOption.YES;
            if (defendantIsSeverelyDisabled && partnerIsDisabled && !isValid(statementOfMeans.partnerSevereDisability)) {
                return false;
            }
        }
        return true;
    }
}
exports.StatementOfMeansTask = StatementOfMeansTask;
