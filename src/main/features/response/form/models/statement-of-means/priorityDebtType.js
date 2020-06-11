"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriorityDebtType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            PriorityDebtType.MORTGAGE,
            PriorityDebtType.RENT,
            PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE,
            PriorityDebtType.GAS,
            PriorityDebtType.ELECTRICITY,
            PriorityDebtType.WATER,
            PriorityDebtType.MAINTENANCE_PAYMENTS
        ];
    }
    static valueOf(value) {
        return PriorityDebtType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.PriorityDebtType = PriorityDebtType;
PriorityDebtType.MORTGAGE = new PriorityDebtType('MORTGAGE', 'Mortgage');
PriorityDebtType.RENT = new PriorityDebtType('RENT', 'Rent');
PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE = new PriorityDebtType('COUNCIL_TAX_COMMUNITY_CHARGE', 'Council Tax or Community Charge');
PriorityDebtType.GAS = new PriorityDebtType('GAS', 'Gas');
PriorityDebtType.ELECTRICITY = new PriorityDebtType('ELECTRICITY', 'Electricity');
PriorityDebtType.WATER = new PriorityDebtType('WATER', 'Water');
PriorityDebtType.MAINTENANCE_PAYMENTS = new PriorityDebtType('MAINTENANCE_PAYMENTS', 'Maintenance payments');
