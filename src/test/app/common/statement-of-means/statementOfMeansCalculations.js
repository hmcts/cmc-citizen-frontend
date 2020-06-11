"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const statementOfMeansCalculations_1 = require("common/statement-of-means/statementOfMeansCalculations");
const bankAccount_1 = require("claims/models/response/statement-of-means/bankAccount");
const income_1 = require("claims/models/response/statement-of-means/income");
const expense_1 = require("claims/models/response/statement-of-means/expense");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
const partyType_1 = require("common/partyType");
const statementOfMeansData_1 = require("test/data/entity/statementOfMeansData");
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const moment = require("moment");
const allowanceRepository_1 = require("common/allowances/allowanceRepository");
const allowanceCalculations_1 = require("main/app/common/allowances/allowanceCalculations");
const path_1 = require("path");
const allowance_1 = require("common/allowances/allowance");
const allowanceItem_1 = require("common/allowances/allowanceItem");
let statementOfMeansCalculations;
let repository;
let allowanceCalculations;
const sampleAllowanceDataLocation = path_1.join(__dirname, '..', '..', '..', 'data', 'entity', 'sampleAllowanceData.json');
const partyType = partyType_1.PartyType.INDIVIDUAL.value;
const dateOfBirthOver18 = moment().subtract(24, 'year');
describe('StatementOfMeansCalculations', () => {
    //
    // DISPOSABLE INCOMES
    //
    describe('calculateTotalMonthlyDisposableIncome', () => {
        beforeEach(() => {
            repository = new allowanceRepository_1.ResourceAllowanceRepository(sampleAllowanceDataLocation);
            allowanceCalculations = new allowanceCalculations_1.AllowanceCalculations(repository);
        });
        describe('when no allowance lookup is provided', () => {
            beforeEach(() => {
                statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations(undefined);
            });
            describe('when defendant has no mortgage or rent expenses and allowances are undefined', () => {
                it('should calculate the total monthly disposable', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeans, partyType, dateOfBirthOver18))
                        .to.equal(2195.416666666667);
                });
            });
            describe('when defendant has mortgage and rent, allowances are undefined', () => {
                it('should return disposable minus monthly mortgage and rent', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansWithMortgageAndRent, partyType, dateOfBirthOver18))
                        .to.equal(1695.416666666667);
                });
            });
            describe('when defendant has priority debts, allowances are undefined', () => {
                it('should return disposable income minus priority debts', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansWithPriorityDebts, partyType, dateOfBirthOver18))
                        .to.equal(1796.5333333333338);
                });
            });
        });
        describe('when allowance lookup is provided', () => {
            beforeEach(() => {
                statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations(allowanceCalculations);
            });
            describe('when defendant has allowances', () => {
                it('should return disposable income minus allowances', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansAllAllowances, partyType, dateOfBirthOver18))
                        .to.equal(2095.416666666667);
                });
            });
            describe('when defendant has mortgage and rent and defendant has allowances', () => {
                it('should return disposable income minus allowances and mortgage', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansWithMortgageAndRent, partyType, dateOfBirthOver18))
                        .to.equal(1670.416666666667);
                });
            });
            describe('when defendant has priority debts and allowances', () => {
                it('should return disposable income minus allowances and priority debts', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansWithPriorityDebtsAndAllowances, partyType, dateOfBirthOver18))
                        .to.equal(1696.5333333333338);
                });
            });
            describe('when defendant has mortgage, rent, priority debts and allowances', () => {
                it('should return disposable income minus allowances, mortgage, rent, debts, priority debts', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(statementOfMeansData_1.sampleStatementOfMeansWithAllDebtsExpensesAndAllowances, partyType, dateOfBirthOver18))
                        .to.equal(1196.5333333333338);
                });
            });
        });
    });
    //
    // EXPENSES
    //
    beforeEach(() => {
        statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations();
    });
    describe('calculateTotalMonthlyExpense', () => {
        describe('when valid debts, courtOrders and expenses are provided', () => {
            it('should calculate the total monthly expense (mortgage and rent only)', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyExpense(statementOfMeansData_1.sampleStatementOfMeansWithMortgageAndRent)).to.equal(640);
            });
        });
        describe('when no debts, courtOrders and expenses are provided', () => {
            it('should calculate a total monthly expense of zero', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyExpense({ bankAccounts: [] })).to.equal(0);
            });
        });
    });
    describe('calculateMonthlyDebts', () => {
        describe('when valid monthly payments are provided', () => {
            it('should calculate the monthly debts', () => {
                const debts = statementOfMeansData_1.sampleStatementOfMeans.debts;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(70);
            });
        });
        describe('when the monthly payment is unknown', () => {
            it('should ignore the debt during the calculation', () => {
                const debts = [
                    {
                        description: 'Something',
                        totalOwed: 3000,
                        monthlyPayments: undefined
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyDebts(debts)).to.equal(0);
            });
        });
    });
    describe('calculateMonthlyCourtOrders', () => {
        describe('when valid monthly instalment amounts are provided', () => {
            it('should calculate the monthly court orders', () => {
                const courtOrders = statementOfMeansData_1.sampleStatementOfMeans.courtOrders;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(70);
            });
        });
        describe('when the monthly instalment amount is unknown', () => {
            it('should ignore the court order during the calculation', () => {
                const courtOrders = [
                    {
                        claimNumber: '123',
                        amountOwed: 2000,
                        monthlyInstalmentAmount: undefined
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0);
            });
        });
        describe('when the monthly instalment amount is negative', () => {
            it('should ignore the court order during the calculation', () => {
                const courtOrders = [
                    {
                        claimNumber: '123',
                        amountOwed: 2000,
                        monthlyInstalmentAmount: -20
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyCourtOrders(courtOrders)).to.equal(0);
            });
        });
    });
    describe('calculateMonthlyRegularExpense', () => {
        describe('when valid amounts and frequencies are provided', () => {
            it('should calculate the total mortgage and rent', () => {
                const expenses = statementOfMeansData_1.sampleStatementOfMeansWithMortgageAndRent.expenses;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(500);
            });
        });
        describe('when the frequency is unknown', () => {
            it('should ignore the regular expense during the calculation', () => {
                const expenses = [
                    {
                        type: expense_1.ExpenseType.ELECTRICITY,
                        frequency: undefined,
                        amount: 100
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0);
            });
        });
        describe('when the amount is unknown', () => {
            it('should ignore the regular expense during the calculation', () => {
                const expenses = [
                    {
                        type: expense_1.ExpenseType.ELECTRICITY,
                        frequency: paymentFrequency_1.PaymentFrequency.MONTH,
                        amount: undefined
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularExpense(expenses)).to.equal(0);
            });
        });
    });
    describe('calculatePriorityDebts', () => {
        describe('when valid amounts and frequencies are provided', () => {
            it('should calculate the total of all priority debts', () => {
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(statementOfMeansData_1.samplePriorityDebts.priorityDebts)).to.equal(398.8833333333333);
            });
        });
        describe('when the frequency is unknown', () => {
            it('should ignore the priority debts during the calculation', () => {
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(statementOfMeansData_1.samplePriorityDebtsNoFrequency.priorityDebts)).to.equal(0);
            });
        });
        describe('when the amount is unknown', () => {
            it('should ignore the priority debts during the calculation', () => {
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyPriorityDebts(statementOfMeansData_1.samplePriorityDebtsNoAmount.priorityDebts)).to.equal(0);
            });
        });
    });
    //
    // INCOMES
    //
    describe('calculateTotalMonthlyIncome', () => {
        describe('when valid bankAccounts, employment and incomes are provided', () => {
            it('should calculate the total monthly income', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyIncome(statementOfMeansData_1.sampleStatementOfMeans)).to.equal(2335.416666666667);
            });
        });
        describe('when no employment and incomes are provided', () => {
            it('should calculate a total monthly income of zero', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyIncome({ bankAccounts: [] })).to.equal(0);
            });
        });
    });
    describe('calculateMonthlySelfEmployedTurnover', () => {
        describe('when self-employed', () => {
            it('should calculate the monthly turnover', () => {
                const employment = statementOfMeansData_1.sampleStatementOfMeans.employment;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(250);
            });
        });
        describe('when self-employed but with no turnover', () => {
            it('should calculate the monthly turnover', () => {
                const employment = {};
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0);
            });
        });
        describe('when not self-employed', () => {
            it('should calculate the monthly turnover', () => {
                const employment = {};
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySelfEmployedTurnover(employment)).to.equal(0);
            });
        });
    });
    describe('calculateMonthlySavings', () => {
        describe('when the bank account balance is unknown', () => {
            it('should ignore the bank account during the calculation', () => {
                const bankAccounts = [
                    {
                        type: bankAccount_1.BankAccountType.CURRENT_ACCOUNT,
                        joint: false,
                        balance: undefined
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0);
            });
        });
        describe('when the bank account balance is negative', () => {
            it('should ignore the bank account during the calculation', () => {
                const bankAccounts = [
                    {
                        type: bankAccount_1.BankAccountType.CURRENT_ACCOUNT,
                        joint: false,
                        balance: -1000
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 0)).to.equal(0);
            });
        });
        describe('when there are no savings in excess', () => {
            it('should calculate a total savings amount of zero', () => {
                const bankAccounts = statementOfMeansData_1.sampleStatementOfMeans.bankAccounts;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 4666.666666667)).to.equal(0);
            });
        });
        describe('when there are savings in excess', () => {
            it('should calculate the total savings amount', () => {
                const bankAccounts = statementOfMeansData_1.sampleStatementOfMeans.bankAccounts;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlySavings(bankAccounts, 3000)).to.equal(208.33333333333334);
            });
        });
    });
    describe('calculateMonthlyRegularIncome', () => {
        describe('when valid amounts and frequencies are provided', () => {
            it('should calculate the total of all regular incomes', () => {
                const incomes = statementOfMeansData_1.sampleStatementOfMeans.incomes;
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(1716.66666666666666);
            });
        });
        describe('when the frequency is unknown', () => {
            it('should ignore the regular income during the calculation', () => {
                const incomes = [
                    {
                        type: income_1.IncomeType.JOB,
                        frequency: undefined,
                        amount: 100
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0);
            });
        });
        describe('when the amount is unknown', () => {
            it('should ignore the regular income during the calculation', () => {
                const incomes = [
                    {
                        type: income_1.IncomeType.JOB,
                        frequency: paymentFrequency_1.PaymentFrequency.MONTH,
                        amount: undefined
                    }
                ];
                chai_1.expect(statementOfMeansCalculations.calculateMonthlyRegularIncome(incomes)).to.equal(0);
            });
        });
    });
    //
    // ALLOWANCES
    //
    describe('calculateTotalMonthlyAllowances', () => {
        beforeEach(() => {
            statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations(allowanceCalculations);
        });
        describe('when defendant is entitled to allowances', () => {
            it('should return a total for all the allowances when defendant under 25 ', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyAllowances(statementOfMeansData_1.sampleStatementOfMeansAllAllowances, 18)).to.equal(275);
            });
            it('should return a total for all the allowances when defendant over 25', () => {
                chai_1.expect(statementOfMeansCalculations.calculateTotalMonthlyAllowances(statementOfMeansData_1.sampleStatementOfMeansAllAllowances, 28)).to.equal(300);
            });
        });
    });
    describe('calculateMonthlyDisabilityAllowance', () => {
        beforeEach(() => {
            statementOfMeansCalculations = new statementOfMeansCalculations_1.StatementOfMeansCalculations(allowanceCalculations);
        });
        describe('when defendant is not disabled', () => {
            describe('when the defendant is not disabled', () => {
                it('should return 0 for disability allowance', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.NO, undefined)).to.equal(0);
                });
            });
            describe('when partner is disabled', () => {
                it('should return 0 for disability allowance', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.NO, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(0);
                });
            });
            describe('when dependant is disabled', () => {
                it('should return amount for dependant care ', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(statementOfMeansData_1.sampleOneDisabledDependantDetails.dependant, false, disabilityStatus_1.DisabilityStatus.NO, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(180);
                });
            });
            describe('when defendant is a carer', () => {
                it('should return amount for carer', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, true, disabilityStatus_1.DisabilityStatus.NO, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(90);
                });
            });
        });
        describe('when defendant is disabled', () => {
            describe('when the defendant is  disabled', () => {
                it('should return a disability allowance for the defendant', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.YES, undefined)).to.equal(100);
                });
            });
            describe('when partner is severely disabled', () => {
                it('should return an allowance for partner disability', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.YES, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(200);
                });
            });
            describe('when defendant and partner are severely disabled', () => {
                it('should return an allowance for both defendant and partner', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.SEVERE, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(250);
                });
            });
            describe('when dependant is disabled', () => {
                it('should return the higher disability allowance for defendant', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, false, disabilityStatus_1.DisabilityStatus.SEVERE, undefined)).to.equal(200);
                });
            });
            describe('when defendant is a carer and is disabled and partner is severely', () => {
                it('should return the higher disability allowance for defendant', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, true, disabilityStatus_1.DisabilityStatus.YES, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(200);
                });
            });
            describe('when defendant is a carer and is disabled', () => {
                it('should return the higher disability allowance for defendant', () => {
                    chai_1.expect(statementOfMeansCalculations.calculateMonthlyDisabilityAllowance(undefined, true, disabilityStatus_1.DisabilityStatus.YES, undefined)).to.equal(100);
                });
            });
        });
    });
    describe('getMonthlyLivingAllowance', () => {
        describe('when date of birth is an invalid date', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(0, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(0);
            });
        });
        describe('when date of birth is undefined', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(undefined, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(0);
            });
        });
        describe('when date of birth makes the defendant less than 18', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(17, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(0);
            });
        });
        describe('when the defendant is over 18 and partner is over 18', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(20, statementOfMeansData_1.samplePartnerDetails.partner)).to.equal(200);
            });
        });
        describe('when date of birth makes the defendant over 25  and partner is over 18', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(25, statementOfMeansData_1.sampleUnder18PartnerDetails.partner)).to.equal(150);
            });
        });
        describe('when date of birth makes the defendant over 18  and partner is over 18', () => {
            it('should return 0 amount', () => {
                chai_1.expect(allowanceCalculations.getMonthlyLivingAllowance(19, statementOfMeansData_1.sampleUnder18PartnerDetails.partner)).to.equal(100);
            });
        });
    });
    describe('getMonthlyDependantsAllowance', () => {
        describe('when number of dependants is one', () => {
            it('should return the allowance amount from one dependant', () => {
                chai_1.expect(allowanceCalculations.getMonthlyDependantsAllowance(statementOfMeansData_1.sampleOneDependantDetails.dependant)).to.equal(100);
            });
        });
        describe('when number of dependants is eleven', () => {
            it('should return the allowance amount from eleven dependants includes other dependants and children in education', () => {
                chai_1.expect(allowanceCalculations.getMonthlyDependantsAllowance(statementOfMeansData_1.sampleElevenDependantDetails.dependant)).to.equal(1100);
            });
        });
        describe('when number of dependants is undefined', () => {
            it('should return the zero', () => {
                chai_1.expect(allowanceCalculations.getMonthlyDependantsAllowance(undefined)).to.equal(0);
            });
        });
    });
    describe('getMonthlyPensionerAllowance', () => {
        describe('when defendant is single and a pensioner', () => {
            it('should return single pensioner allowance', () => {
                chai_1.expect(allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeansData_1.sampleIncomesWithPensionData.incomes, undefined)).to.equal(50);
            });
        });
        describe('when defendant and partner are pensioner', () => {
            it('should return single pensioner allowance and partner is a pensioner', () => {
                chai_1.expect(allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeansData_1.sampleIncomesWithPensionData.incomes, statementOfMeansData_1.samplePartnerPensioner.partner)).to.equal(100);
            });
        });
        describe('when defendant is not a pensioner and partner is pensioner', () => {
            it('should return single pensioner allowance and partner is a pensioner', () => {
                chai_1.expect(allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeansData_1.sampleIncomesData.incomes, statementOfMeansData_1.samplePartnerPensioner.partner)).to.equal(0);
            });
        });
        describe('when defendant is single and not a pensioner', () => {
            it('should return single pensioner allowance', () => {
                chai_1.expect(allowanceCalculations.getMonthlyPensionerAllowance(statementOfMeansData_1.sampleIncomesData.incomes, undefined)).to.equal(0);
            });
        });
    });
    describe('allowances', () => {
        describe('deserialize', () => {
            context('when there is a single allowance present', () => {
                it('should return valid data', () => {
                    const input = {
                        allowances: [{
                                personal: [{ item: 'item1', weekly: 10, monthly: 50 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 50 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 50 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 50 }],
                                startDate: '2018-05-01T00:00:00.000Z'
                            }]
                    };
                    const allowance = new allowance_1.Allowances().deserialize(input);
                    chai_1.expect(allowance.personal[0].monthly).to.equal(50);
                });
            });
            context('when there is a single allowance present but start date in the future', () => {
                it('should return no data', () => {
                    const input = {
                        allowances: [{
                                personal: [{ item: 'item1', weekly: 10, monthly: 50 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 50 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 50 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 50 }],
                                startDate: moment().add(1, 'day').toISOString()
                            }]
                    };
                    const allowance = new allowance_1.Allowances().deserialize(input);
                    chai_1.expect(allowance).to.equal(undefined);
                });
            });
            context('when there are multiple data present', () => {
                it('should return valid data that is not in the future', () => {
                    const input = {
                        allowances: [
                            {
                                personal: [{ item: 'item1', weekly: 10, monthly: 50 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 50 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 50 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 50 }],
                                startDate: '2018-05-01T00:00:00.000Z'
                            },
                            {
                                personal: [{ item: 'item1', weekly: 10, monthly: 100 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 100 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 100 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 100 }],
                                startDate: moment().add(1, 'day').toISOString()
                            }
                        ]
                    };
                    const allowance = new allowance_1.Allowances().deserialize(input);
                    chai_1.expect(allowance.personal[0].monthly).to.equal(50);
                });
                it('should return valid data', () => {
                    const input = {
                        allowances: [
                            {
                                personal: [{ item: 'item1', weekly: 10, monthly: 50 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 50 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 50 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 50 }],
                                startDate: '2018-05-01T00:00:00.000Z'
                            },
                            {
                                personal: [{ item: 'item1', weekly: 10, monthly: 100 }],
                                dependant: [{ item: 'item2', weekly: 10, monthly: 100 }],
                                pensioner: [{ item: 'item3', weekly: 10, monthly: 100 }],
                                disability: [{ item: 'item4', weekly: 10, monthly: 100 }],
                                startDate: moment().add(-1, 'day').toISOString()
                            }
                        ]
                    };
                    const allowance = new allowance_1.Allowances().deserialize(input);
                    chai_1.expect(allowance.personal[0].monthly).to.equal(100);
                });
            });
        });
    });
    describe('allowance', () => {
        describe('deserialize', () => {
            describe('when a valid personal input is supplied ', () => {
                it('should return valid data', () => {
                    const input = {
                        personal: [{ item: 'SINGLE_18_TO_24', weekly: 10, monthly: 50 }],
                        startDate: moment()
                    };
                    const allowance = new allowance_1.Allowance().deserialize(input);
                    chai_1.expect(allowance.personal[0].monthly).to.equal(50);
                });
            });
            describe('when a invalid personal input is supplied ', () => {
                it('should return undefined allowance', () => {
                    const allowance = new allowance_1.Allowance().deserialize(undefined);
                    chai_1.expect(allowance).to.equal(undefined);
                });
            });
        });
    });
    describe('allowanceItem', () => {
        describe('deserialize', () => {
            describe('when a valid personal input is supplied ', () => {
                it('should return valid data', () => {
                    const input = { item: 'SINGLE_18_TO_24', weekly: 10, monthly: 50 };
                    const allowanceItem = new allowanceItem_1.AllowanceItem().deserialize(input);
                    chai_1.expect(allowanceItem.monthly).to.equal(50);
                });
            });
        });
    });
});
