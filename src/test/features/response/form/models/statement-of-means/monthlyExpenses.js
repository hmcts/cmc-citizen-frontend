"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
const monthlyExpenses_1 = require("response/form/models/statement-of-means/monthlyExpenses");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
function getSampleMonthlyExpensesObject(options) {
    const DEFAULT_SAMPLE_VALID_MONTHLY_EXPENSES = {
        mortgage: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        rent: {
            amount: 200,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        councilTax: {
            amount: 300,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        gas: {
            amount: 400,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        electricity: {
            amount: 500,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        water: {
            amount: 600,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        travel: {
            amount: 700,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        schoolCosts: {
            amount: 800,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        foodAndHousekeeping: {
            amount: 900,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        tvAndBroadband: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        hirePurchase: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        mobilePhone: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        maintenance: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        }
    };
    const sampleData = Object.assign({}, DEFAULT_SAMPLE_VALID_MONTHLY_EXPENSES, options || {});
    return {
        sampleData,
        forConstructor: forConstructor,
        forFromObjectMethod: forFromObjectMethod,
        forDeserialize: forDeserialize
    };
}
function forConstructor() {
    return new monthlyExpenses_1.MonthlyExpenses(undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue, this.sampleData.mortgage.amount, this.sampleData.mortgage.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue, this.sampleData.rent.amount, this.sampleData.rent.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue, this.sampleData.councilTax.amount, this.sampleData.councilTax.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue, this.sampleData.gas.amount, this.sampleData.gas.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue, this.sampleData.electricity.amount, this.sampleData.electricity.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue, this.sampleData.water.amount, this.sampleData.water.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue, this.sampleData.travel.amount, this.sampleData.travel.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue, this.sampleData.schoolCosts.amount, this.sampleData.schoolCosts.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, this.sampleData.foodAndHousekeeping.amount, this.sampleData.foodAndHousekeeping.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue, this.sampleData.tvAndBroadband.amount, this.sampleData.tvAndBroadband.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue, this.sampleData.hirePurchase.amount, this.sampleData.hirePurchase.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue, this.sampleData.mobilePhone.amount, this.sampleData.mobilePhone.schedule), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, this.sampleData.maintenance.amount, this.sampleData.maintenance.schedule));
}
function forFromObjectMethod() {
    return {
        mortgageDeclared: this.sampleData.mortgageDeclared,
        mortgage: {
            amount: this.sampleData.mortgage.amount,
            schedule: this.sampleData.mortgage.schedule.value
        },
        rentDeclared: this.sampleData.rentDeclared,
        rent: {
            amount: this.sampleData.rent.amount,
            schedule: this.sampleData.rent.schedule.value
        },
        councilTaxDeclared: this.sampleData.councilTaxDeclared,
        councilTax: {
            amount: this.sampleData.councilTax.amount,
            schedule: this.sampleData.councilTax.schedule.value
        },
        gasDeclared: this.sampleData.gasDeclared,
        gas: {
            amount: this.sampleData.gas.amount,
            schedule: this.sampleData.gas.schedule.value
        },
        electricityDeclared: this.sampleData.electricityDeclared,
        electricity: {
            amount: this.sampleData.electricity.amount,
            schedule: this.sampleData.electricity.schedule.value
        },
        waterDeclared: this.sampleData.waterDeclared,
        water: {
            amount: this.sampleData.water.amount,
            schedule: this.sampleData.water.schedule.value
        },
        travelDeclared: this.sampleData.travelDeclared,
        travel: {
            amount: this.sampleData.travel.amount,
            schedule: this.sampleData.travel.schedule.value
        },
        schoolCostsDeclared: this.sampleData.schoolCostsDeclared,
        schoolCosts: {
            amount: this.sampleData.schoolCosts.amount,
            schedule: this.sampleData.schoolCosts.schedule.value
        },
        foodAndHousekeepingDeclared: this.sampleData.foodAndHousekeepingDeclared,
        foodAndHousekeeping: {
            amount: this.sampleData.foodAndHousekeeping.amount,
            schedule: this.sampleData.foodAndHousekeeping.schedule.value
        },
        tvAndBroadbandDeclared: this.sampleData.tvAndBroadbandDeclared,
        tvAndBroadband: {
            amount: this.sampleData.tvAndBroadband.amount,
            schedule: this.sampleData.tvAndBroadband.schedule.value
        },
        hirePurchaseDeclared: this.sampleData.hirePurchaseDeclared,
        hirePurchase: {
            amount: this.sampleData.hirePurchase.amount,
            schedule: this.sampleData.hirePurchase.schedule.value
        },
        mobilePhoneDeclared: this.sampleData.mobilePhoneDeclared,
        mobilePhone: {
            amount: this.sampleData.mobilePhone.amount,
            schedule: this.sampleData.mobilePhone.schedule.value
        },
        maintenanceDeclared: this.sampleData.maintenanceDeclared,
        maintenance: {
            amount: this.sampleData.maintenance.amount,
            schedule: this.sampleData.maintenance.schedule.value
        }
    };
}
function forDeserialize() {
    return {
        mortgageDeclared: this.sampleData.mortgageDeclared,
        mortgage: {
            name: monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue,
            amount: this.sampleData.mortgage.amount,
            schedule: this.sampleData.mortgage.schedule
        },
        rentDeclared: this.sampleData.rentDeclared,
        rent: {
            name: monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue,
            amount: this.sampleData.rent.amount,
            schedule: this.sampleData.rent.schedule
        },
        councilTaxDeclared: this.sampleData.councilTaxDeclared,
        councilTax: {
            name: monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue,
            amount: this.sampleData.councilTax.amount,
            schedule: this.sampleData.councilTax.schedule
        },
        gasDeclared: this.sampleData.gasDeclared,
        gas: {
            name: monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue,
            amount: this.sampleData.gas.amount,
            schedule: this.sampleData.gas.schedule
        },
        electricityDeclared: this.sampleData.electricityDeclared,
        electricity: {
            name: monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue,
            amount: this.sampleData.electricity.amount,
            schedule: this.sampleData.electricity.schedule
        },
        waterDeclared: this.sampleData.waterDeclared,
        water: {
            name: monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue,
            amount: this.sampleData.water.amount,
            schedule: this.sampleData.water.schedule
        },
        travelDeclared: this.sampleData.travelDeclared,
        travel: {
            name: monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue,
            amount: this.sampleData.travel.amount,
            schedule: this.sampleData.travel.schedule
        },
        schoolCostsDeclared: this.sampleData.schoolCostsDeclared,
        schoolCosts: {
            name: monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue,
            amount: this.sampleData.schoolCosts.amount,
            schedule: this.sampleData.schoolCosts.schedule
        },
        foodAndHousekeepingDeclared: this.sampleData.foodAndHousekeepingDeclared,
        foodAndHousekeeping: {
            name: monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue,
            amount: this.sampleData.foodAndHousekeeping.amount,
            schedule: this.sampleData.foodAndHousekeeping.schedule
        },
        tvAndBroadbandDeclared: this.sampleData.tvAndBroadbandDeclared,
        tvAndBroadband: {
            name: monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue,
            amount: this.sampleData.tvAndBroadband.amount,
            schedule: this.sampleData.tvAndBroadband.schedule
        },
        hirePurchaseDeclared: this.sampleData.hirePurchaseDeclared,
        hirePurchase: {
            name: monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue,
            amount: this.sampleData.hirePurchase.amount,
            schedule: this.sampleData.hirePurchase.schedule
        },
        mobilePhoneDeclared: this.sampleData.mobilePhoneDeclared,
        mobilePhone: {
            name: monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue,
            amount: this.sampleData.mobilePhone.amount,
            schedule: this.sampleData.mobilePhone.schedule
        },
        maintenanceDeclared: this.sampleData.maintenanceDeclared,
        maintenance: {
            name: monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue,
            amount: this.sampleData.maintenance.amount,
            schedule: this.sampleData.maintenance.schedule
        },
        other: [{}]
    };
}
describe('MonthlyExpenses', () => {
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(monthlyExpenses_1.MonthlyExpenses.fromObject(undefined)).to.eql(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(monthlyExpenses_1.MonthlyExpenses.fromObject()).to.deep.equal(undefined);
        });
        it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
            chai_1.expect(monthlyExpenses_1.MonthlyExpenses.fromObject({})).to.deep.equal(new monthlyExpenses_1.MonthlyExpenses(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined));
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const sampleMonthlyExpensesData = getSampleMonthlyExpensesObject().forFromObjectMethod();
            const expectedMonthlyExpensesObject = getSampleMonthlyExpensesObject().forConstructor();
            chai_1.expect(monthlyExpenses_1.MonthlyExpenses.fromObject(sampleMonthlyExpensesData)).to.deep.equal(expectedMonthlyExpensesObject);
        });
    });
    describe('deserialize', () => {
        it('should return instance initialised with defaults when undefined provided', () => {
            chai_1.expect(new monthlyExpenses_1.MonthlyExpenses().deserialize(undefined)).to.deep.equal(new monthlyExpenses_1.MonthlyExpenses());
        });
        it('should return instance initialised with set fields from object provided', () => {
            chai_1.expect(new monthlyExpenses_1.MonthlyExpenses().deserialize(getSampleMonthlyExpensesObject().forDeserialize())).to.deep.equal(getSampleMonthlyExpensesObject().forConstructor());
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when not successful', () => {
            it('should return errors when `ExpenseSource` objects are invalid', () => {
                const errors = validator.validateSync(new monthlyExpenses_1.MonthlyExpenses(undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue, -200, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue, -300, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue, -400, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue, -500, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue, -600, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue, -700, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue, -800, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, -900, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS)));
                chai_1.expect(errors.length).to.equal(13);
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue));
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue));
            });
            describe('when successful', () => {
                it('should return no error when `hasSource` is true and `source` is invalid', () => {
                    const sampleMonthlyExpensesData = getSampleMonthlyExpensesObject().forFromObjectMethod();
                    const errors = validator.validateSync(sampleMonthlyExpensesData);
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
