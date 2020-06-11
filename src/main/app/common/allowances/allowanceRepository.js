"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowance_1 = require("common/allowances/allowance");
const path_1 = require("path");
class ResourceAllowanceRepository {
    constructor(path) {
        this.path = path;
        const resourcePath = path || path_1.join(__dirname, '..', '..', '..', 'resources', 'meansAllowance.json');
        this.allowances = new allowance_1.Allowances().deserialize(require(resourcePath));
    }
    getDependantAllowance(dependantAllowanceType) {
        return this.allowances.dependant ?
            this.getMonthlyAllowanceAmount(this.allowances.dependant, dependantAllowanceType) : undefined;
    }
    getDisabilityAllowance(disabilityAllowanceType) {
        return this.allowances.disability ?
            this.getMonthlyAllowanceAmount(this.allowances.disability, disabilityAllowanceType) : undefined;
    }
    getLivingAllowance(livingAllowanceType) {
        return this.allowances.personal ?
            this.getMonthlyAllowanceAmount(this.allowances.personal, livingAllowanceType) : undefined;
    }
    getPensionAllowance(pensionAllowanceType) {
        return this.allowances.pensioner ?
            this.getMonthlyAllowanceAmount(this.allowances.pensioner, pensionAllowanceType) : undefined;
    }
    getMonthlyAllowanceAmount(searchArray, filterOption) {
        return searchArray.filter(category => category.item === filterOption).pop();
    }
}
exports.ResourceAllowanceRepository = ResourceAllowanceRepository;
