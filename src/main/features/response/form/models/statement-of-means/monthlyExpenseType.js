"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonthlyExpenseType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            MonthlyExpenseType.MORTGAGE,
            MonthlyExpenseType.RENT,
            MonthlyExpenseType.COUNCIL_TAX,
            MonthlyExpenseType.GAS,
            MonthlyExpenseType.ELECTRICITY,
            MonthlyExpenseType.WATER,
            MonthlyExpenseType.TRAVEL,
            MonthlyExpenseType.SCHOOL_COSTS,
            MonthlyExpenseType.FOOD_HOUSEKEEPING,
            MonthlyExpenseType.TV_AND_BROADBAND,
            MonthlyExpenseType.HIRE_PURCHASES,
            MonthlyExpenseType.MOBILE_PHONE,
            MonthlyExpenseType.MAINTENANCE_PAYMENTS,
            MonthlyExpenseType.OTHER
        ];
    }
    static valueOf(value) {
        return MonthlyExpenseType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.MonthlyExpenseType = MonthlyExpenseType;
MonthlyExpenseType.MORTGAGE = new MonthlyExpenseType('MORTGAGE', 'mortgage');
MonthlyExpenseType.RENT = new MonthlyExpenseType('RENT', 'rent');
MonthlyExpenseType.COUNCIL_TAX = new MonthlyExpenseType('COUNCIL_TAX', 'Council Tax');
MonthlyExpenseType.GAS = new MonthlyExpenseType('GAS', 'gas');
MonthlyExpenseType.ELECTRICITY = new MonthlyExpenseType('ELECTRICITY', 'electricity');
MonthlyExpenseType.WATER = new MonthlyExpenseType('WATER', 'water');
MonthlyExpenseType.TRAVEL = new MonthlyExpenseType('TRAVEL', 'travel (work or school)');
MonthlyExpenseType.SCHOOL_COSTS = new MonthlyExpenseType('SCHOOL_COSTS', 'school costs (include clothing)');
MonthlyExpenseType.FOOD_HOUSEKEEPING = new MonthlyExpenseType('FOOD_HOUSEKEEPING', 'food and housekeeping');
MonthlyExpenseType.TV_AND_BROADBAND = new MonthlyExpenseType('TV_AND_BROADBAND', 'TV and broadband');
MonthlyExpenseType.HIRE_PURCHASES = new MonthlyExpenseType('HIRE_PURCHASES', 'hire purchase');
MonthlyExpenseType.MOBILE_PHONE = new MonthlyExpenseType('MOBILE_PHONE', 'mobile phone');
MonthlyExpenseType.MAINTENANCE_PAYMENTS = new MonthlyExpenseType('MAINTENANCE_PAYMENTS', 'maintenance payments');
MonthlyExpenseType.OTHER = new MonthlyExpenseType('OTHER', 'other expense');
