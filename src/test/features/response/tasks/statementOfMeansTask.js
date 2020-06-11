"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const bankAccountRow_1 = require("response/form/models/statement-of-means/bankAccountRow");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
const onTaxPayments_1 = require("response/form/models/statement-of-means/onTaxPayments");
const statementOfMeansTask_1 = require("response/tasks/statementOfMeansTask");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const responseDraft_1 = require("response/draft/responseDraft");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paymentPlan_1 = require("shared/components/payment-intention/model/paymentPlan");
const momentFactory_1 = require("shared/momentFactory");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const localDateUtils_1 = require("test/localDateUtils");
const statementOfMeans_1 = require("response/draft/statementOfMeans");
const residence_1 = require("response/form/models/statement-of-means/residence");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const individualDetails_1 = require("forms/models/individualDetails");
const defendant_1 = require("drafts/models/defendant");
const responseType_1 = require("response/form/models/responseType");
const response_1 = require("response/form/models/response");
const employment_1 = require("response/form/models/statement-of-means/employment");
const bankAccounts_1 = require("response/form/models/statement-of-means/bankAccounts");
const dependants_1 = require("response/form/models/statement-of-means/dependants");
const numberOfChildren_1 = require("response/form/models/statement-of-means/numberOfChildren");
const education_1 = require("response/form/models/statement-of-means/education");
const unemployment_1 = require("response/form/models/statement-of-means/unemployment");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const employers_1 = require("response/form/models/statement-of-means/employers");
const employerRow_1 = require("response/form/models/statement-of-means/employerRow");
const selfEmployment_1 = require("response/form/models/statement-of-means/selfEmployment");
const otherDependants_1 = require("response/form/models/statement-of-means/otherDependants");
const numberOfPeople_1 = require("response/form/models/statement-of-means/numberOfPeople");
const debts_1 = require("response/form/models/statement-of-means/debts");
const courtOrders_1 = require("response/form/models/statement-of-means/courtOrders");
const monthlyIncome_1 = require("response/form/models/statement-of-means/monthlyIncome");
const monthlyExpenses_1 = require("response/form/models/statement-of-means/monthlyExpenses");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
const explanation_1 = require("response/form/models/statement-of-means/explanation");
const incomeSource_1 = require("response/form/models/statement-of-means/incomeSource");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const disability_1 = require("response/form/models/statement-of-means/disability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
function validResponseDraftWith(paymentType) {
    const responseDraft = new responseDraft_1.ResponseDraft();
    responseDraft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
    responseDraft.fullAdmission = new responseDraft_1.FullAdmission();
    responseDraft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
    responseDraft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentType);
    switch (paymentType) {
        case paymentOption_1.PaymentType.BY_SET_DATE:
            responseDraft.fullAdmission.paymentIntention.paymentDate = new paymentDate_1.PaymentDate(localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate()));
            break;
        case paymentOption_1.PaymentType.INSTALMENTS:
            responseDraft.fullAdmission.paymentIntention.paymentPlan = new paymentPlan_1.PaymentPlan(1000, 100, localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate().add(1, 'day')), paymentSchedule_1.PaymentSchedule.EACH_WEEK);
            break;
    }
    responseDraft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
    responseDraft.defendantDetails = new defendant_1.Defendant(new individualDetails_1.IndividualDetails());
    responseDraft.statementOfMeans = new statementOfMeans_1.StatementOfMeans();
    // this is the simplest valid structure
    responseDraft.statementOfMeans.residence = new residence_1.Residence(residenceType_1.ResidenceType.OWN_HOME, 'description');
    responseDraft.statementOfMeans.disability = new disability_1.Disability(disability_1.DisabilityOption.NO);
    responseDraft.statementOfMeans.cohabiting = new cohabiting_1.Cohabiting(cohabiting_1.CohabitingOption.NO);
    responseDraft.statementOfMeans.dependants = new dependants_1.Dependants(false);
    responseDraft.statementOfMeans.otherDependants = new otherDependants_1.OtherDependants(false);
    responseDraft.statementOfMeans.employment = new employment_1.Employment(false);
    responseDraft.statementOfMeans.unemployment = new unemployment_1.Unemployment(unemploymentType_1.UnemploymentType.RETIRED);
    responseDraft.statementOfMeans.bankAccounts = new bankAccounts_1.BankAccounts([new bankAccountRow_1.BankAccountRow(bankAccountType_1.BankAccountType.CURRENT_ACCOUNT, false, 100)]);
    responseDraft.statementOfMeans.debts = new debts_1.Debts(false);
    responseDraft.statementOfMeans.monthlyIncome = new monthlyIncome_1.MonthlyIncome(true, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, undefined, undefined));
    responseDraft.statementOfMeans.monthlyExpenses = new monthlyExpenses_1.MonthlyExpenses(true, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue, 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, undefined, undefined), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue, undefined, undefined));
    responseDraft.statementOfMeans.courtOrders = new courtOrders_1.CourtOrders(false);
    responseDraft.statementOfMeans.explanation = new explanation_1.Explanation('Some explanation');
    return responseDraft;
}
describe('StatementOfMeansTask', () => {
    context('statement of means', () => {
        let responseDraft;
        beforeEach(() => {
            responseDraft = validResponseDraftWith(paymentOption_1.PaymentType.BY_SET_DATE);
        });
        context('when it applies', () => {
            it('should not be completed when statement of means is undefined', () => {
                responseDraft.statementOfMeans = undefined;
                chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
            });
            it('should not be completed when residence is undefined', () => {
                responseDraft.statementOfMeans.residence = undefined;
                chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
            });
            it('should not be completed when residence is invalid', () => {
                responseDraft.statementOfMeans.residence.type = undefined;
                chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
            });
            it('should be completed when all SOM items are valid', () => {
                chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
            });
        });
        context('isCompleted: ', () => {
            context('dependants group', () => {
                context('is completed when', () => {
                    it('no children, no one supported', () => {
                        responseDraft.statementOfMeans.dependants.declared = false;
                        responseDraft.statementOfMeans.otherDependants.declared = false;
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                    it('no children, but supported', () => {
                        responseDraft.statementOfMeans.dependants.declared = false;
                        responseDraft.statementOfMeans.otherDependants = new otherDependants_1.OtherDependants(true, new numberOfPeople_1.NumberOfPeople(3, 'story'));
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                    it('has young children', () => {
                        responseDraft.statementOfMeans.dependants = new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(2, 1, 0));
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                    it('has children between 16 and 19 and they do not educate', () => {
                        const noOfChildrenBetween16and19 = 2;
                        responseDraft.statementOfMeans.dependants = new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 0, noOfChildrenBetween16and19));
                        responseDraft.statementOfMeans.education = new education_1.Education(0, noOfChildrenBetween16and19);
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                    it('has children between 16 and 19 and they educate', () => {
                        const noOfChildrenBetween16and19 = 2;
                        responseDraft.statementOfMeans.dependants = new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 0, noOfChildrenBetween16and19));
                        responseDraft.statementOfMeans.education = new education_1.Education(1, noOfChildrenBetween16and19);
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                    it('has monthly income', () => {
                        responseDraft.statementOfMeans.monthlyIncome = new monthlyIncome_1.MonthlyIncome(true, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, undefined, undefined), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, undefined, undefined), undefined, []);
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                    });
                });
                context('is not completed', () => {
                    it('dependants section not submitted', () => {
                        responseDraft.statementOfMeans.dependants = undefined;
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                    });
                    it('dependants submitted with children between 16 and 19 and education section not submitted', () => {
                        responseDraft.statementOfMeans.dependants = new dependants_1.Dependants(true, new numberOfChildren_1.NumberOfChildren(0, 0, 1));
                        responseDraft.statementOfMeans.education = undefined;
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                    });
                    it('other dependants not submitted', () => {
                        responseDraft.statementOfMeans.otherDependants = undefined;
                        chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                    });
                });
            });
            context('employment group is completed when', () => {
                it('unemployed (default setup for mock)', () => {
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                });
                it('employed with list of employers', () => {
                    responseDraft.statementOfMeans.unemployment = undefined;
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, true, false);
                    responseDraft.statementOfMeans.employers = new employers_1.Employers([new employerRow_1.EmployerRow('Company', 'job')]);
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                });
                it('self-employed and not employed', () => {
                    responseDraft.statementOfMeans.unemployment = undefined;
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, false, true);
                    responseDraft.statementOfMeans.employers = undefined;
                    responseDraft.statementOfMeans.selfEmployment = new selfEmployment_1.SelfEmployment('job', 1000);
                    responseDraft.statementOfMeans.onTaxPayments = new onTaxPayments_1.OnTaxPayments(false);
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                });
                it('self-employed and employed', () => {
                    responseDraft.statementOfMeans.unemployment = undefined;
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, true, true);
                    responseDraft.statementOfMeans.employers = new employers_1.Employers([new employerRow_1.EmployerRow('Company', 'job')]);
                    responseDraft.statementOfMeans.selfEmployment = new selfEmployment_1.SelfEmployment('job', 1000);
                    responseDraft.statementOfMeans.onTaxPayments = new onTaxPayments_1.OnTaxPayments(false);
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                });
                it('self-employed with on tax payments', () => {
                    responseDraft.statementOfMeans.unemployment = undefined;
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, false, true);
                    responseDraft.statementOfMeans.selfEmployment = new selfEmployment_1.SelfEmployment('job', 1000);
                    responseDraft.statementOfMeans.onTaxPayments = new onTaxPayments_1.OnTaxPayments(true, 100, 'Taxes');
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.true;
                });
            });
            context('is not completed when', () => {
                it('employment not submitted', () => {
                    responseDraft.statementOfMeans.employment = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('selected "no" for employment and not submitted unemployed', () => {
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(false);
                    responseDraft.statementOfMeans.unemployment = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('employed and not submitted employers', () => {
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, true, false);
                    responseDraft.statementOfMeans.employers = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('self-employed and not submitted selfEmployed', () => {
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, false, true);
                    responseDraft.statementOfMeans.selfEmployment = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('employed and self-employed and not submitted selfEmployed nor employers', () => {
                    responseDraft.statementOfMeans.employment = new employment_1.Employment(true, true, true);
                    responseDraft.statementOfMeans.selfEmployment = undefined;
                    responseDraft.statementOfMeans.employers = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
            });
            context('is not completed when', () => {
                it('residence not submitted', () => {
                    responseDraft.statementOfMeans.residence = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('bankAccounts not submitted', () => {
                    responseDraft.statementOfMeans.bankAccounts = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('debts not submitted', () => {
                    responseDraft.statementOfMeans.debts = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('monthlyIncome not submitted', () => {
                    responseDraft.statementOfMeans.monthlyIncome = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('monthlyExpenses not submitted', () => {
                    responseDraft.statementOfMeans.monthlyExpenses = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('courtOrders not submitted', () => {
                    responseDraft.statementOfMeans.courtOrders = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
                it('explanation not submitted', () => {
                    responseDraft.statementOfMeans.explanation = undefined;
                    chai_1.expect(statementOfMeansTask_1.StatementOfMeansTask.isCompleted(responseDraft)).to.be.false;
                });
            });
        });
    });
});
