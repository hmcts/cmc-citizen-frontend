"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
const partyType_1 = require("common/partyType");
class DefendantAgeOption {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return this.all().filter(defendantAgeOption => defendantAgeOption.option === input).pop();
    }
    static all() {
        return [
            DefendantAgeOption.YES,
            DefendantAgeOption.NO,
            DefendantAgeOption.COMPANY_OR_ORGANISATION
        ];
    }
}
exports.DefendantAgeOption = DefendantAgeOption;
DefendantAgeOption.YES = new DefendantAgeOption(yesNoOption_1.YesNoOption.YES.option);
DefendantAgeOption.NO = new DefendantAgeOption(yesNoOption_1.YesNoOption.NO.option);
DefendantAgeOption.COMPANY_OR_ORGANISATION = new DefendantAgeOption(partyType_1.PartyType.ORGANISATION.value);
