"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const monthlyExpenseType_1 = require("./monthlyExpenseType");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
const class_validator_1 = require("@hmcts/class-validator");
class MonthlyExpenses {
    constructor(mortgageDeclared, mortgage, rentDeclared, rent, councilTaxDeclared, councilTax, gasDeclared, gas, electricityDeclared, electricity, waterDeclared, water, travelDeclared, travel, schoolCostsDeclared, schoolCosts, foodAndHousekeepingDeclared, foodAndHousekeeping, tvAndBroadbandDeclared, tvAndBroadband, hirePurchaseDeclared, hirePurchase, mobilePhoneDeclared, mobilePhone, maintenanceDeclared, maintenance, otherDeclared, other = [new expenseSource_1.ExpenseSource()]) {
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
        this.travelDeclared = travelDeclared;
        this.travel = travel;
        this.schoolCostsDeclared = schoolCostsDeclared;
        this.schoolCosts = schoolCosts;
        this.foodAndHousekeepingDeclared = foodAndHousekeepingDeclared;
        this.foodAndHousekeeping = foodAndHousekeeping;
        this.tvAndBroadbandDeclared = tvAndBroadbandDeclared;
        this.tvAndBroadband = tvAndBroadband;
        this.hirePurchaseDeclared = hirePurchaseDeclared;
        this.hirePurchase = hirePurchase;
        this.mobilePhoneDeclared = mobilePhoneDeclared;
        this.mobilePhone = mobilePhone;
        this.maintenanceDeclared = maintenanceDeclared;
        this.maintenance = maintenance;
        this.otherDeclared = otherDeclared;
        this.other = other;
    }
    get anyOtherPopulated() {
        return !!this.other && this.other.some(source => source.populated);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new MonthlyExpenses(value.mortgageDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue, value.mortgage), value.rentDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue, value.rent), value.councilTaxDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue, value.councilTax), value.gasDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue, value.gas), value.electricityDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue, value.electricity), value.waterDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue, value.water), value.travelDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue, value.travel), value.schoolCostsDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue, value.schoolCosts), value.foodAndHousekeepingDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, value.foodAndHousekeeping), value.tvAndBroadbandDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue, value.tvAndBroadband), value.hirePurchaseDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue, value.hirePurchase), value.mobilePhoneDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue, value.mobilePhone), value.maintenanceDeclared, expenseSource_1.ExpenseSource.fromObject(monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, value.maintenance), value.otherDeclared, value.other && value.other
            .map(source => expenseSource_1.ExpenseSource.fromObject(source.name, source))
            .filter(source => source !== undefined));
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
            this.travelDeclared = input.travelDeclared;
            this.travel = new expenseSource_1.ExpenseSource().deserialize(input.travel);
            this.schoolCostsDeclared = input.schoolCostsDeclared;
            this.schoolCosts = new expenseSource_1.ExpenseSource().deserialize(input.schoolCosts);
            this.foodAndHousekeepingDeclared = input.foodAndHousekeepingDeclared;
            this.foodAndHousekeeping = new expenseSource_1.ExpenseSource().deserialize(input.foodAndHousekeeping);
            this.tvAndBroadbandDeclared = input.tvAndBroadbandDeclared;
            this.tvAndBroadband = new expenseSource_1.ExpenseSource().deserialize(input.tvAndBroadband);
            this.hirePurchaseDeclared = input.hirePurchaseDeclared;
            this.hirePurchase = new expenseSource_1.ExpenseSource().deserialize(input.hirePurchase);
            this.mobilePhoneDeclared = input.mobilePhoneDeclared;
            this.mobilePhone = new expenseSource_1.ExpenseSource().deserialize(input.mobilePhone);
            this.maintenanceDeclared = input.maintenanceDeclared;
            this.maintenance = new expenseSource_1.ExpenseSource().deserialize(input.maintenance);
            this.otherDeclared = input.otherDeclared;
            this.other = input.other && input.other.map(source => new expenseSource_1.ExpenseSource().deserialize(source));
        }
        return this;
    }
    addEmptyOtherExpense() {
        this.other.push(new expenseSource_1.ExpenseSource());
    }
    removeOtherExpense(source) {
        this.other.splice(this.other.findIndex(element => element === source), 1);
    }
    resetExpense(propertyName, source) {
        this[`${propertyName.split('.')[0]}Declared`] = false;
        source.reset();
    }
}
__decorate([
    class_validator_1.ValidateIf((o) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "mortgage", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.rentDeclared || (o.rent && o.rent.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "rent", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "councilTax", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.gasDeclared || (o.gas && o.gas.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "gas", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.electricityDeclared || (o.electricity && o.electricity.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "electricity", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.waterDeclared || (o.water && o.water.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "water", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.travelDeclared || (o.travel && o.travel.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "travel", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.schoolCostsDeclared || (o.schoolCosts && o.schoolCosts.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "schoolCosts", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.foodAndHousekeepingDeclared ||
        (o.foodAndHousekeeping && o.foodAndHousekeeping.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "foodAndHousekeeping", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.tvAndBroadbandDeclared || (o.tvAndBroadband && o.tvAndBroadband.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "tvAndBroadband", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.hirePurchaseDeclared || (o.hirePurchase && o.hirePurchase.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "hirePurchase", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.mobilePhoneDeclared || (o.mobilePhone && o.mobilePhone.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "mobilePhone", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated)),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "maintenance", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.otherDeclared || o.anyOtherPopulated),
    class_validator_1.ValidateNested()
], MonthlyExpenses.prototype, "other", void 0);
exports.MonthlyExpenses = MonthlyExpenses;
