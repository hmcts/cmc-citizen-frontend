"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MadeBy {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static valueOf(value) {
        return MadeBy.all().filter(type => type.value === value).pop();
    }
    static all() {
        return [
            MadeBy.CLAIMANT,
            MadeBy.DEFENDANT
        ];
    }
}
exports.MadeBy = MadeBy;
MadeBy.CLAIMANT = new MadeBy('CLAIMANT', 'Claimant');
MadeBy.DEFENDANT = new MadeBy('DEFENDANT', 'Defendant');
MadeBy.COURT = new MadeBy('COURT', 'Court');
