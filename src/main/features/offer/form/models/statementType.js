"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatementType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static valueOf(value) {
        return StatementType.all().filter(type => type.value === value).pop();
    }
    static all() {
        return [
            StatementType.OFFER,
            StatementType.ACCEPTATION,
            StatementType.REJECTION
        ];
    }
}
exports.StatementType = StatementType;
StatementType.OFFER = new StatementType('OFFER', 'Offer');
StatementType.ACCEPTATION = new StatementType('ACCEPTATION', 'Acceptation');
StatementType.REJECTION = new StatementType('REJECTION', 'Rejection');
