"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onTaxPayments_1 = require("response/form/models/statement-of-means/onTaxPayments");
const residence_1 = require("response/form/models/statement-of-means/residence");
const employment_1 = require("response/form/models/statement-of-means/employment");
const employers_1 = require("response/form/models/statement-of-means/employers");
const selfEmployment_1 = require("response/form/models/statement-of-means/selfEmployment");
const dependants_1 = require("response/form/models/statement-of-means/dependants");
const education_1 = require("response/form/models/statement-of-means/education");
const otherDependants_1 = require("response/form/models/statement-of-means/otherDependants");
const unemployment_1 = require("response/form/models/statement-of-means/unemployment");
const bankAccounts_1 = require("response/form/models/statement-of-means/bankAccounts");
const debts_1 = require("response/form/models/statement-of-means/debts");
const courtOrders_1 = require("response/form/models/statement-of-means/courtOrders");
const monthlyIncome_1 = require("response/form/models/statement-of-means/monthlyIncome");
const monthlyExpenses_1 = require("response/form/models/statement-of-means/monthlyExpenses");
const explanation_1 = require("response/form/models/statement-of-means/explanation");
const disability_1 = require("response/form/models/statement-of-means/disability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const partnerAge_1 = require("response/form/models/statement-of-means/partnerAge");
const partnerPension_1 = require("response/form/models/statement-of-means/partnerPension");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const partnerSevereDisability_1 = require("response/form/models/statement-of-means/partnerSevereDisability");
const dependantsDisability_1 = require("response/form/models/statement-of-means/dependantsDisability");
const otherDependantsDisability_1 = require("response/form/models/statement-of-means/otherDependantsDisability");
const carer_1 = require("response/form/models/statement-of-means/carer");
const priorityDebt_1 = require("response/form/models/statement-of-means/priorityDebt");
class StatementOfMeans {
    deserialize(input) {
        if (input) {
            this.residence = new residence_1.Residence().deserialize(input.residence);
            this.dependants = new dependants_1.Dependants().deserialize(input.dependants);
            this.education = new education_1.Education().deserialize(input.education);
            this.otherDependants = new otherDependants_1.OtherDependants().deserialize(input.otherDependants);
            this.employment = new employment_1.Employment().deserialize(input.employment);
            this.employers = new employers_1.Employers().deserialize(input.employers);
            this.selfEmployment = new selfEmployment_1.SelfEmployment().deserialize(input.selfEmployment);
            this.onTaxPayments = new onTaxPayments_1.OnTaxPayments().deserialize(input.onTaxPayments);
            this.unemployment = new unemployment_1.Unemployment().deserialize(input.unemployment);
            this.bankAccounts = new bankAccounts_1.BankAccounts().deserialize(input.bankAccounts);
            this.debts = new debts_1.Debts().deserialize(input.debts);
            this.monthlyIncome = new monthlyIncome_1.MonthlyIncome().deserialize(input.monthlyIncome);
            this.monthlyExpenses = new monthlyExpenses_1.MonthlyExpenses().deserialize(input.monthlyExpenses);
            this.courtOrders = new courtOrders_1.CourtOrders().deserialize(input.courtOrders);
            this.explanation = new explanation_1.Explanation().deserialize(input.explanation);
            this.priorityDebt = new priorityDebt_1.PriorityDebt().deserialize(input.priorityDebt);
            this.disability = new disability_1.Disability(input.disability && input.disability.option);
            this.severeDisability = new severeDisability_1.SevereDisability(input.severeDisability && input.severeDisability.option);
            this.cohabiting = new cohabiting_1.Cohabiting(input.cohabiting && input.cohabiting.option);
            this.partnerAge = new partnerAge_1.PartnerAge(input.partnerAge && input.partnerAge.option);
            this.partnerPension = new partnerPension_1.PartnerPension(input.partnerPension && input.partnerPension.option);
            this.partnerDisability = new partnerDisability_1.PartnerDisability(input.partnerDisability && input.partnerDisability.option);
            this.partnerSevereDisability = new partnerSevereDisability_1.PartnerSevereDisability(input.partnerSevereDisability && input.partnerSevereDisability.option);
            this.dependantsDisability = new dependantsDisability_1.DependantsDisability(input.dependantsDisability && input.dependantsDisability.option);
            this.otherDependantsDisability = new otherDependantsDisability_1.OtherDependantsDisability(input.otherDependantsDisability && input.otherDependantsDisability.option);
            this.carer = new carer_1.Carer(input.carer && input.carer.option);
        }
        return this;
    }
}
exports.StatementOfMeans = StatementOfMeans;
