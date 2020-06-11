"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const moment = require("moment");
const frequencyConversions_1 = require("common/frequency/frequencyConversions");
const frequency_1 = require("common/frequency/frequency");
const expense_1 = require("claims/models/response/statement-of-means/expense");
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const partyType_1 = require("common/partyType");
const logger = nodejs_logging_1.Logger.getLogger('common/statement-of-means');
class StatementOfMeansCalculations {
    constructor(allowanceCalculations) {
        this.allowanceCalculations = allowanceCalculations;
    }
    calculateTotalMonthlyDisposableIncome(statementOfMeans, defendantType, defendantDateOfBirth) {
        const defendantAge = moment().diff(moment(defendantDateOfBirth), 'years');
        const totalMonthlyIncome = this.calculateTotalMonthlyIncome(statementOfMeans) || 0;
        const totalMonthlyExpense = this.calculateTotalMonthlyExpense(statementOfMeans) || 0;
        let totalMonthlyAllowance = 0;
        if (this.allowanceCalculations) {
            totalMonthlyAllowance = defendantType === partyType_1.PartyType.INDIVIDUAL.value ?
                this.calculateTotalMonthlyAllowances(statementOfMeans, defendantAge) || 0 : 0;
        }
        const totalMonthlyDisposableIncome = (totalMonthlyIncome - totalMonthlyExpense) - totalMonthlyAllowance;
        logger.info('Monthly disposable income calculation: ', totalMonthlyDisposableIncome);
        return totalMonthlyDisposableIncome;
    }
    calculateTotalMonthlyExpense(statementOfMeans) {
        const monthlyDebts = statementOfMeans.debts ? this.calculateMonthlyDebts(statementOfMeans.debts) : 0;
        const monthlyPriorityDebts = statementOfMeans.priorityDebts ? this.calculateMonthlyPriorityDebts(statementOfMeans.priorityDebts) : 0;
        const monthlyCourtOrders = statementOfMeans.courtOrders ? this.calculateMonthlyCourtOrders(statementOfMeans.courtOrders) : 0;
        const monthlyRegularExpense = statementOfMeans.expenses ? this.calculateMonthlyRegularExpense(statementOfMeans.expenses) : 0;
        const totalMonthlyExpense = monthlyDebts + monthlyPriorityDebts + monthlyCourtOrders + monthlyRegularExpense;
        logger.debug('Monthly expense calculation: ', totalMonthlyExpense);
        return totalMonthlyExpense;
    }
    calculateTotalMonthlyAllowances(statementOfMeans, defendantAge) {
        const monthlyLivingAllowance = this.allowanceCalculations.getMonthlyLivingAllowance(defendantAge, statementOfMeans.partner);
        const monthlyDependantsAllowance = this.allowanceCalculations.getMonthlyDependantsAllowance(statementOfMeans.dependant);
        const monthlyPensionerAllowance = this.allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeans.incomes, statementOfMeans.partner);
        const monthlyDisabilityAllowance = this.calculateMonthlyDisabilityAllowance(statementOfMeans.dependant, statementOfMeans.carer, statementOfMeans.disability, statementOfMeans.partner);
        const totalMonthlyAllowance = monthlyLivingAllowance + monthlyDependantsAllowance + monthlyPensionerAllowance +
            monthlyDisabilityAllowance;
        logger.debug('Monthly allowance calculation: ', totalMonthlyAllowance);
        return totalMonthlyAllowance;
    }
    calculateMonthlyDisabilityAllowance(dependant, carer, defendantDisability, partner) {
        if (defendantDisability === disabilityStatus_1.DisabilityStatus.NO || defendantDisability === undefined) {
            return this.allowanceCalculations.getCarerDisableDependantAmount(dependant, carer);
        }
        return this.allowanceCalculations.getDisabilityAllowance(defendantDisability, partner);
    }
    calculateMonthlyDebts(debts) {
        const reducer = (total, debt) => {
            const monthlyPayments = debt.monthlyPayments;
            if (!monthlyPayments) {
                return total;
            }
            return total + monthlyPayments;
        };
        const monthlyDebts = debts.reduce(reducer, 0);
        logger.debug('Monthly debts calculation: ', monthlyDebts);
        return monthlyDebts;
    }
    calculateMonthlyCourtOrders(courtOrders) {
        const reducer = (total, courtOrder) => {
            const monthlyInstalmentAmount = courtOrder.monthlyInstalmentAmount;
            if (!monthlyInstalmentAmount || monthlyInstalmentAmount < 0) {
                return total;
            }
            return total + monthlyInstalmentAmount;
        };
        const monthlyCourtOrders = courtOrders.reduce(reducer, 0);
        logger.debug('Monthly Court orders calculation: ', monthlyCourtOrders);
        return monthlyCourtOrders;
    }
    calculateMonthlyPriorityDebts(priorityDebts) {
        const monthlyPriorityDebts = this.calculateMonthlyRegularIncomesExpensesOrDebts(priorityDebts);
        logger.debug('Monthly priority debts calculation: ', monthlyPriorityDebts);
        return monthlyPriorityDebts;
    }
    calculateMonthlyRegularExpense(expenses) {
        const monthlyRegularExpense = this.calculateMonthlyRegularIncomesExpensesOrDebts(expenses.filter(value => {
            return value.type === expense_1.ExpenseType.RENT || value.type === expense_1.ExpenseType.MORTGAGE;
        }));
        logger.debug('Monthly regular expense calculation: ', monthlyRegularExpense);
        return monthlyRegularExpense;
    }
    calculateTotalMonthlyIncome(statementOfMeans) {
        const monthlyRegularIncome = statementOfMeans.incomes ? this.calculateMonthlyRegularIncome(statementOfMeans.incomes) : 0;
        const monthlySelfEmployedTurnover = statementOfMeans.employment ? this.calculateMonthlySelfEmployedTurnover(statementOfMeans.employment) : 0;
        const monthlySavings = this.calculateMonthlySavings(statementOfMeans.bankAccounts, monthlyRegularIncome);
        const totalMonthlyIncome = monthlySelfEmployedTurnover + monthlySavings + monthlyRegularIncome;
        logger.debug('Monthly income calculation: ', totalMonthlyIncome);
        return totalMonthlyIncome;
    }
    calculateMonthlySelfEmployedTurnover(employment) {
        if (!employment.selfEmployment || !employment.selfEmployment.annualTurnover) {
            return 0;
        }
        const monthlySelfEmployedTurnover = employment.selfEmployment.annualTurnover / 12;
        logger.debug('Monthly self employed turnover: ', monthlySelfEmployedTurnover);
        return monthlySelfEmployedTurnover;
    }
    calculateMonthlySavings(bankAccounts, monthlyRegularIncome) {
        if (!bankAccounts) {
            return 0;
        }
        const reducer = (total, bankAccount) => {
            const balance = bankAccount.balance;
            if (!balance || balance < 0) {
                return total;
            }
            return total + balance;
        };
        const savings = bankAccounts.reduce(reducer, 0);
        const savingsInExcess = savings - (monthlyRegularIncome * 1.5);
        if (savingsInExcess < 0) {
            return 0;
        }
        const monthlySavings = savingsInExcess / 12;
        logger.debug('Monthly savings calculation: ', monthlySavings);
        return monthlySavings;
    }
    calculateMonthlyRegularIncome(incomes) {
        const monthlyRegularIncome = this.calculateMonthlyRegularIncomesExpensesOrDebts(incomes);
        logger.debug('Monthly regular income calculation: ', monthlyRegularIncome);
        return monthlyRegularIncome;
    }
    calculateMonthlyRegularIncomesExpensesOrDebts(incomesExpensesOrDebts) {
        const reducer = (total, incomeExpenseOrDebt) => {
            const frequency = this.toFrequency(incomeExpenseOrDebt.frequency);
            const amount = incomeExpenseOrDebt.amount;
            if (!frequency || !amount) {
                return total;
            }
            return total + frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(amount, frequency);
        };
        return incomesExpensesOrDebts.reduce(reducer, 0);
    }
    toFrequency(paymentFrequency) {
        try {
            return frequency_1.Frequency.of(paymentFrequency);
        }
        catch (error) {
            return undefined;
        }
    }
}
exports.StatementOfMeansCalculations = StatementOfMeansCalculations;
