"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const income_1 = require("claims/models/response/statement-of-means/income");
const allowance_1 = require("common/allowances/allowance");
class AllowanceCalculations {
    constructor(allowances) {
        this.allowances = allowances;
    }
    getMonthlyPensionerAllowance(income, partner) {
        if (!income) {
            return 0;
        }
        const isDefendantPensioner = income.filter(incomeType => incomeType.type === income_1.IncomeType.PENSION).pop() !== undefined;
        if (isDefendantPensioner) {
            if (partner && partner.pensioner) {
                return this.getMonthlyAmount(this.allowances.getPensionAllowance(allowance_1.PensionAllowanceType.DEFENDANT_AND_PARTNER));
            }
            else {
                return this.getMonthlyAmount(this.allowances.getPensionAllowance(allowance_1.PensionAllowanceType.DEFENDANT_ONLY));
            }
        }
        return 0;
    }
    getMonthlyDependantsAllowance(dependants) {
        if (!dependants) {
            return 0;
        }
        let numberOfDependants = 0;
        if (dependants.children) {
            const reducer = (total, children) => {
                const numberOfDependants = children.ageGroupType !== dependant_1.AgeGroupType.BETWEEN_16_AND_19 ?
                    children.numberOfChildren : children.numberOfChildrenLivingWithYou;
                if (!numberOfDependants) {
                    return total;
                }
                return total + numberOfDependants;
            };
            numberOfDependants = dependants.children.reduce(reducer, 0);
        }
        if (dependants.otherDependants) {
            numberOfDependants += dependants.otherDependants.numberOfPeople;
        }
        const monthlyAmount = this.getMonthlyAmount(this.allowances.getDependantAllowance(allowance_1.DependantAllowanceType.PER_DEPENDANT));
        return (numberOfDependants * monthlyAmount);
    }
    getMonthlyLivingAllowance(defendantAge, partner) {
        if (defendantAge < 18 || defendantAge === undefined) {
            return 0;
        }
        let cohabitationStatus;
        if (!partner) {
            cohabitationStatus = defendantAge < 25 ? allowance_1.LivingAllowanceType.SINGLE_18_TO_24 : allowance_1.LivingAllowanceType.SINGLE_OVER_25;
        }
        else {
            if (partner.over18) {
                cohabitationStatus = allowance_1.LivingAllowanceType.DEFENDANT_AND_PARTNER_OVER_18;
            }
            else {
                cohabitationStatus = defendantAge < 25 ? allowance_1.LivingAllowanceType.DEFENDANT_UNDER_25_PARTNER_UNDER_18 :
                    allowance_1.LivingAllowanceType.DEFENDANT_OVER_25_PARTNER_UNDER_18;
            }
        }
        return this.getMonthlyAmount(this.allowances.getLivingAllowance(cohabitationStatus));
    }
    getCarerDisableDependantAmount(dependant, isCarer) {
        const disabledDependantAmount = this.getDisabledDependantAmount(dependant);
        const carerAmount = this.getCarerAmount(isCarer);
        return disabledDependantAmount > carerAmount ? disabledDependantAmount : carerAmount;
    }
    getDisabilityAllowance(defendantDisability, partner) {
        if (defendantDisability === disabilityStatus_1.DisabilityStatus.NO) {
            return 0;
        }
        let disabledStatus = defendantDisability === disabilityStatus_1.DisabilityStatus.YES ?
            allowance_1.DisabilityAllowanceType.DEFENDANT_ONLY : allowance_1.DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE;
        if (partner && partner.disability) {
            switch (partner.disability) {
                case disabilityStatus_1.DisabilityStatus.YES:
                    disabledStatus = defendantDisability === disabilityStatus_1.DisabilityStatus.YES ?
                        allowance_1.DisabilityAllowanceType.DEFENDANT_AND_PARTNER : allowance_1.DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE;
                    break;
                case disabilityStatus_1.DisabilityStatus.SEVERE:
                    disabledStatus = defendantDisability === disabilityStatus_1.DisabilityStatus.YES ?
                        allowance_1.DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE : allowance_1.DisabilityAllowanceType.DEFENDANT_AND_PARTNER_SEVERE;
                    break;
                default:
                    break;
            }
        }
        return this.getMonthlyAmount(this.allowances.getDisabilityAllowance(disabledStatus));
    }
    getDisabledDependantAmount(dependant) {
        if (dependant) {
            if (dependant.anyDisabledChildren) {
                return this.allowances.getDisabilityAllowance(allowance_1.DisabilityAllowanceType.DEPENDANT).monthly || 0;
            }
            if (dependant.otherDependants) {
                if (dependant.otherDependants.anyDisabled) {
                    return this.allowances.getDisabilityAllowance(allowance_1.DisabilityAllowanceType.DEPENDANT).monthly || 0;
                }
            }
        }
    }
    getCarerAmount(isCarer) {
        return isCarer ? this.allowances.getDisabilityAllowance(allowance_1.DisabilityAllowanceType.CARER).monthly : 0;
    }
    getMonthlyAmount(allowanceItem) {
        if (!allowanceItem || !allowanceItem.monthly) {
            return 0;
        }
        return allowanceItem.monthly;
    }
}
exports.AllowanceCalculations = AllowanceCalculations;
