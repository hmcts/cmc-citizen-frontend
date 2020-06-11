"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnemploymentType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            UnemploymentType.UNEMPLOYED,
            UnemploymentType.RETIRED,
            UnemploymentType.OTHER
        ];
    }
    static valueOf(value) {
        return UnemploymentType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.UnemploymentType = UnemploymentType;
UnemploymentType.UNEMPLOYED = new UnemploymentType('UNEMPLOYED', 'Unemployed');
UnemploymentType.RETIRED = new UnemploymentType('RETIRED', 'Retired');
UnemploymentType.OTHER = new UnemploymentType('OTHER', 'Other');
