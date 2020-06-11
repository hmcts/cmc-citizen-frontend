"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const priorityDebt_1 = require("response/form/models/statement-of-means/priorityDebt");
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const chai_1 = require("chai");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
function getSamplePriorityDebtObject() {
    const sampleData = {
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
        maintenance: {
            amount: 700,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
        }
    };
    return {
        sampleData,
        forConstructor: forConstructor,
        forFromObject: forFromObject,
        forDeserialize: forDeserialize
    };
}
function forConstructor() {
    return new priorityDebt_1.PriorityDebt(true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue, this.sampleData.mortgage.amount, this.sampleData.mortgage.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.RENT.displayValue, this.sampleData.rent.amount, this.sampleData.rent.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, this.sampleData.councilTax.amount, this.sampleData.councilTax.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.GAS.displayValue, this.sampleData.gas.amount, this.sampleData.gas.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue, this.sampleData.electricity.amount, this.sampleData.electricity.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.WATER.displayValue, this.sampleData.water.amount, this.sampleData.water.schedule), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, this.sampleData.maintenance.amount, this.sampleData.maintenance.schedule));
}
function forDeserialize() {
    return {
        mortgageDeclared: true,
        mortgage: {
            name: priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue,
            amount: this.sampleData.mortgage.amount,
            schedule: this.sampleData.mortgage.schedule
        },
        rentDeclared: true,
        rent: {
            name: priorityDebtType_1.PriorityDebtType.RENT.displayValue,
            amount: this.sampleData.rent.amount,
            schedule: this.sampleData.rent.schedule
        },
        councilTaxDeclared: true,
        councilTax: {
            name: priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue,
            amount: this.sampleData.councilTax.amount,
            schedule: this.sampleData.councilTax.schedule
        },
        gasDeclared: true,
        gas: {
            name: priorityDebtType_1.PriorityDebtType.GAS.displayValue,
            amount: this.sampleData.gas.amount,
            schedule: this.sampleData.gas.schedule
        },
        electricityDeclared: true,
        electricity: {
            name: priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue,
            amount: this.sampleData.electricity.amount,
            schedule: this.sampleData.electricity.schedule
        },
        waterDeclared: true,
        water: {
            name: priorityDebtType_1.PriorityDebtType.WATER.displayValue,
            amount: this.sampleData.water.amount,
            schedule: this.sampleData.water.schedule
        },
        maintenanceDeclared: true,
        maintenance: {
            name: priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue,
            amount: this.sampleData.maintenance.amount,
            schedule: this.sampleData.maintenance.schedule
        }
    };
}
function forFromObject() {
    return {
        mortgageDeclared: true,
        mortgage: {
            amount: this.sampleData.mortgage.amount,
            schedule: this.sampleData.mortgage.schedule.value
        },
        rentDeclared: true,
        rent: {
            amount: this.sampleData.rent.amount,
            schedule: this.sampleData.rent.schedule.value
        },
        councilTaxDeclared: true,
        councilTax: {
            amount: this.sampleData.councilTax.amount,
            schedule: this.sampleData.councilTax.schedule.value
        },
        gasDeclared: true,
        gas: {
            amount: this.sampleData.gas.amount,
            schedule: this.sampleData.gas.schedule.value
        },
        electricityDeclared: true,
        electricity: {
            amount: this.sampleData.electricity.amount,
            schedule: this.sampleData.electricity.schedule.value
        },
        waterDeclared: true,
        water: {
            amount: this.sampleData.water.amount,
            schedule: this.sampleData.water.schedule.value
        },
        maintenanceDeclared: true,
        maintenance: {
            amount: this.sampleData.maintenance.amount,
            schedule: this.sampleData.maintenance.schedule.value
        }
    };
}
describe('PriorityDebt', () => {
    describe('deserialize', () => {
        it('should return instance initialised with default values when undefined provided', () => {
            chai_1.expect(new priorityDebt_1.PriorityDebt().deserialize(undefined)).to.deep.equal(new priorityDebt_1.PriorityDebt());
        });
        it('should return instance initialised with given values when given an object', () => {
            chai_1.expect(new priorityDebt_1.PriorityDebt().deserialize(getSamplePriorityDebtObject().forDeserialize()))
                .to.deep.equal(getSamplePriorityDebtObject().forConstructor());
        });
    });
    describe('fromObject', () => {
        it('should return undefined when given undefined', () => {
            chai_1.expect(priorityDebt_1.PriorityDebt.fromObject(undefined)).to.equal(undefined);
        });
        it('should return undefined when given no parameter', () => {
            chai_1.expect(priorityDebt_1.PriorityDebt.fromObject()).to.equal(undefined);
        });
        it('should return a new instance with defaults when an empty object is provided', () => {
            chai_1.expect(priorityDebt_1.PriorityDebt.fromObject({})).to.deep.equal(new priorityDebt_1.PriorityDebt(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined));
        });
        it('should return a new instance with fields containing values from the given object', () => {
            chai_1.expect(priorityDebt_1.PriorityDebt.fromObject(getSamplePriorityDebtObject().forFromObject()))
                .to.deep.equal(getSamplePriorityDebtObject().forConstructor());
        });
    });
    describe('when validated', () => {
        const validator = new class_validator_1.Validator();
        it('Should return validation errors for each field that is invalid', () => {
            const errors = validator.validateSync(new priorityDebt_1.PriorityDebt(undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.RENT.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.GAS.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.WATER.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), undefined, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, -1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK)));
            chai_1.expect(errors.length).to.be.equal(priorityDebtType_1.PriorityDebtType.all().length);
            priorityDebtType_1.PriorityDebtType.all().forEach(value => {
                validationUtils_1.expectValidationError(errors, expenseSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(value.displayValue));
            });
        });
        it('should return no error when successful', () => {
            const errors = validator.validateSync(new priorityDebt_1.PriorityDebt(true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.RENT.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.GAS.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.WATER.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, 1, incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK)));
            chai_1.expect(errors.length).to.be.equal(0);
        });
    });
});
