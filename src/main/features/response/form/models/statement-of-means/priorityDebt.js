"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const expenseSource_1 = require("./expenseSource");
const class_validator_1 = require("@hmcts/class-validator");
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
class PriorityDebt {
    constructor(mortgageDeclared, mortgage, rentDeclared, rent, councilTaxDeclared, councilTax, gasDeclared, gas, electricityDeclared, electricity, waterDeclared, water, maintenanceDeclared, maintenance) {
        this.mortgageDeclared = mortgageDeclared;
        this.mortgage = mortgage;
        this.rentDeclared = rentDeclared;
        this.rent = rent;
        this.councilTaxDeclared = councilTaxDeclared;
        this.councilTax = councilTax;
        this.gasDeclared = gasDeclared;
        this.gas = gas;
        this.electricityDeclared = electricityDeclared;
        this.electricity = electricity;
        this.waterDeclared = waterDeclared;
        this.water = water;
        this.maintenanceDeclared = maintenanceDeclared;
        this.maintenance = maintenance;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new PriorityDebt(value.mortgageDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue, value.mortgage), value.rentDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.RENT.displayValue, value.rent), value.councilTaxDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, value.councilTax), value.gasDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.GAS.displayValue, value.gas), value.electricityDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue, value.electricity), value.waterDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.WATER.displayValue, value.water), value.maintenanceDeclared, expenseSource_1.ExpenseSource.fromObject(priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, value.maintenance));
    }
    deserialize(input) {
        if (input) {
            this.mortgageDeclared = input.mortgageDeclared;
            this.mortgage = new expenseSource_1.ExpenseSource().deserialize(input.mortgage);
            this.rentDeclared = input.rentDeclared;
            this.rent = new expenseSource_1.ExpenseSource().deserialize(input.rent);
            this.councilTaxDeclared = input.councilTaxDeclared;
            this.councilTax = new expenseSource_1.ExpenseSource().deserialize(input.councilTax);
            this.gasDeclared = input.gasDeclared;
            this.gas = new expenseSource_1.ExpenseSource().deserialize(input.gas);
            this.electricityDeclared = input.electricityDeclared;
            this.electricity = new expenseSource_1.ExpenseSource().deserialize(input.electricity);
            this.waterDeclared = input.waterDeclared;
            this.water = new expenseSource_1.ExpenseSource().deserialize(input.water);
            this.maintenanceDeclared = input.maintenanceDeclared;
            this.maintenance = new expenseSource_1.ExpenseSource().deserialize(input.maintenance);
        }
        return this;
    }
    resetIncome(propertyName, source) {
        this[`${propertyName.split('.')[0]}Declared`] = false;
        source.reset();
    }
}
__decorate([
    class_validator_1.ValidateIf((o) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "mortgage", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.rentDeclared || (o.rent && o.rent.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "rent", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "councilTax", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.gasDeclared || (o.gas && o.gas.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "gas", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.electricityDeclared || (o.electricity && o.electricity.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "electricity", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.waterDeclared || (o.water && o.water.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "water", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated)),
    class_validator_1.ValidateNested()
], PriorityDebt.prototype, "maintenance", void 0);
exports.PriorityDebt = PriorityDebt;
