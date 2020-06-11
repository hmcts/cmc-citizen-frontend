"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowanceItem_1 = require("common/allowances/allowanceItem");
const momentFactory_1 = require("shared/momentFactory");
const moment = require("moment");
var DependantAllowanceType;
(function (DependantAllowanceType) {
    DependantAllowanceType["PER_DEPENDANT"] = "EACH";
})(DependantAllowanceType = exports.DependantAllowanceType || (exports.DependantAllowanceType = {}));
var DisabilityAllowanceType;
(function (DisabilityAllowanceType) {
    DisabilityAllowanceType["DEFENDANT_ONLY"] = "DEFENDANT_ONLY";
    DisabilityAllowanceType["DEFENDANT_ONLY_SEVERE"] = "DEFENDANT_ONLY_SEVERE";
    DisabilityAllowanceType["DEFENDANT_AND_PARTNER"] = "DEFENDANT_AND_PARTNER";
    DisabilityAllowanceType["DEFENDANT_AND_PARTNER_SEVERE"] = "DEFENDANT_AND_PARTNER_SEVERE";
    DisabilityAllowanceType["DEPENDANT"] = "DEPENDANT";
    DisabilityAllowanceType["CARER"] = "CARER";
})(DisabilityAllowanceType = exports.DisabilityAllowanceType || (exports.DisabilityAllowanceType = {}));
var PensionAllowanceType;
(function (PensionAllowanceType) {
    PensionAllowanceType["DEFENDANT_ONLY"] = "DEFENDANT_ONLY";
    PensionAllowanceType["DEFENDANT_AND_PARTNER"] = "DEFENDANT_AND_PARTNER";
})(PensionAllowanceType = exports.PensionAllowanceType || (exports.PensionAllowanceType = {}));
var LivingAllowanceType;
(function (LivingAllowanceType) {
    LivingAllowanceType["SINGLE_18_TO_24"] = "SINGLE_18_TO_24";
    LivingAllowanceType["SINGLE_OVER_25"] = "SINGLE_OVER_25";
    LivingAllowanceType["DEFENDANT_AND_PARTNER_OVER_18"] = "DEFENDANT_AND_PARTNER_OVER_18";
    LivingAllowanceType["DEFENDANT_UNDER_25_PARTNER_UNDER_18"] = "DEFENDANT_UNDER_25_PARTNER_UNDER_18";
    LivingAllowanceType["DEFENDANT_OVER_25_PARTNER_UNDER_18"] = "DEFENDANT_OVER_25_PARTNER_UNDER_18";
})(LivingAllowanceType = exports.LivingAllowanceType || (exports.LivingAllowanceType = {}));
class Allowances {
    constructor(allowance) {
        this.allowance = allowance;
    }
    deserialize(input) {
        if (!input) {
            return input;
        }
        this.allowance = this.deserializeRows(input.allowances);
        return this.allowance
            .sort((a, b) => {
            return a.startDate.diff(b.startDate, 'days');
        })
            .filter(date => date.startDate.isSameOrBefore(moment()))
            .pop();
    }
    deserializeRows(rows) {
        let allowanceRows = rows.map(row => new Allowance().deserialize(row));
        return allowanceRows;
    }
}
exports.Allowances = Allowances;
class Allowance {
    constructor(personal, dependant, pensioner, disability, startDate) {
        this.personal = personal;
        this.dependant = dependant;
        this.pensioner = pensioner;
        this.disability = disability;
        this.startDate = startDate;
    }
    deserialize(input) {
        if (!input) {
            return input;
        }
        this.personal = input.personal && this.deserializeAllowanceItem(input.personal);
        this.dependant = input.dependant && this.deserializeAllowanceItem(input.dependant);
        this.pensioner = input.pensioner && this.deserializeAllowanceItem(input.pensioner);
        this.disability = input.disability && this.deserializeAllowanceItem(input.disability);
        this.startDate = momentFactory_1.MomentFactory.parse(input.startDate);
        return this;
    }
    deserializeAllowanceItem(allowanceItem) {
        if (!allowanceItem) {
            return allowanceItem;
        }
        return allowanceItem.map(allowanceItem => new allowanceItem_1.AllowanceItem().deserialize(allowanceItem));
    }
}
exports.Allowance = Allowance;
