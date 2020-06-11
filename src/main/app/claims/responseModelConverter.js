"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defenceType_1 = require("claims/models/response/defenceType");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
const responseType_1 = require("claims/models/response/responseType");
const partyType_1 = require("common/partyType");
const individual_1 = require("claims/models/details/yours/individual");
const company_1 = require("claims/models/details/yours/company");
const address_1 = require("claims/models/address");
const organisation_1 = require("claims/models/details/yours/organisation");
const soleTrader_1 = require("claims/models/details/yours/soleTrader");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
const responseType_2 = require("response/form/models/responseType");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const paymentDeclaration_1 = require("claims/models/paymentDeclaration");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const evidenceConverter_1 = require("claims/converters/evidenceConverter");
const momentFactory_1 = require("shared/momentFactory");
const income_1 = require("claims/models/response/statement-of-means/income");
const expense_1 = require("claims/models/response/statement-of-means/expense");
const yesNoOption_1 = require("models/yesNoOption");
const priorityDebts_1 = require("claims/models/response/statement-of-means/priorityDebts");
const dependantsDisability_1 = require("response/form/models/statement-of-means/dependantsDisability");
const otherDependantsDisability_1 = require("response/form/models/statement-of-means/otherDependantsDisability");
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const partnerAge_1 = require("response/form/models/statement-of-means/partnerAge");
const partnerPension_1 = require("response/form/models/statement-of-means/partnerPension");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const partnerSevereDisability_1 = require("response/form/models/statement-of-means/partnerSevereDisability");
const carer_1 = require("response/form/models/statement-of-means/carer");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const disability_1 = require("response/form/models/statement-of-means/disability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const featureToggles_1 = require("utils/featureToggles");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const freeMediationUtil_1 = require("shared/utils/freeMediationUtil");
const responseMethod_1 = require("claims/models/response/responseMethod");
class ResponseModelConverter {
    static convert(draft, mediationDraft, directionsQuestionnaireDraft, claim) {
        switch (draft.response.type) {
            case responseType_2.ResponseType.DEFENCE:
                if (draft.isResponseRejectedFullyBecausePaidWhatOwed()
                    && draft.rejectAllOfClaim.howMuchHaveYouPaid.amount < claim.totalAmountTillToday) {
                    return this.convertFullDefenceAsPartialAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft);
                }
                return this.convertFullDefence(draft, claim, mediationDraft, directionsQuestionnaireDraft);
            case responseType_2.ResponseType.FULL_ADMISSION:
                return this.convertFullAdmission(draft, claim, mediationDraft);
            case responseType_2.ResponseType.PART_ADMISSION:
                return this.convertPartAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft);
            default:
                throw new Error(`Unsupported response type: ${draft.response.type.value}`);
        }
    }
    static convertFullDefence(draft, claim, mediationDraft, directionsQuestionnaireDraft) {
        return {
            responseType: responseType_1.ResponseType.FULL_DEFENCE,
            responseMethod: responseMethod_1.ResponseMethod.DIGITAL,
            defendant: this.convertPartyDetails(draft.defendantDetails),
            defenceType: this.inferDefenceType(draft),
            defence: draft.defence.text,
            timeline: {
                rows: draft.timeline.getPopulatedRowsOnly(),
                comment: draft.timeline.comment
            },
            evidence: {
                rows: evidenceConverter_1.convertEvidence(draft.evidence),
                comment: draft.evidence.comment
            },
            freeMediation: freeMediationUtil_1.FreeMediationUtil.getFreeMediation(mediationDraft),
            mediationPhoneNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
            mediationContactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
            paymentDeclaration: draft.isResponseRejectedFullyBecausePaidWhatOwed() ? new paymentDeclaration_1.PaymentDeclaration(draft.rejectAllOfClaim.howMuchHaveYouPaid.date.asString(), draft.rejectAllOfClaim.howMuchHaveYouPaid.amount, draft.rejectAllOfClaim.howMuchHaveYouPaid.text) : undefined,
            statementOfTruth: this.convertStatementOfTruth(draft),
            directionsQuestionnaire: (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') &&
                claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
        };
    }
    static convertFullDefenceAsPartialAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft) {
        return {
            responseType: responseType_1.ResponseType.PART_ADMISSION,
            responseMethod: responseMethod_1.ResponseMethod.DIGITAL,
            amount: draft.rejectAllOfClaim.howMuchHaveYouPaid.amount,
            paymentDeclaration: {
                paidDate: draft.rejectAllOfClaim.howMuchHaveYouPaid.date.asString(),
                explanation: draft.rejectAllOfClaim.howMuchHaveYouPaid.text
            },
            defence: draft.rejectAllOfClaim.whyDoYouDisagree.text,
            timeline: {
                rows: draft.timeline.getPopulatedRowsOnly(),
                comment: draft.timeline.comment
            },
            evidence: {
                rows: evidenceConverter_1.convertEvidence(draft.evidence),
                comment: draft.evidence.comment
            },
            freeMediation: freeMediationUtil_1.FreeMediationUtil.getFreeMediation(mediationDraft),
            mediationPhoneNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
            mediationContactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
            defendant: this.convertPartyDetails(draft.defendantDetails),
            statementOfTruth: this.convertStatementOfTruth(draft),
            directionsQuestionnaire: (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') &&
                claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
        };
    }
    static convertFullAdmission(draft, claim, mediationDraft) {
        return {
            responseType: responseType_1.ResponseType.FULL_ADMISSION,
            responseMethod: responseMethod_1.ResponseMethod.DIGITAL,
            freeMediation: freeMediationUtil_1.FreeMediationUtil.getFreeMediation(mediationDraft),
            mediationPhoneNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
            mediationContactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
            defendant: this.convertPartyDetails(draft.defendantDetails),
            paymentIntention: this.convertPaymentIntention(draft.fullAdmission.paymentIntention),
            statementOfMeans: this.convertStatementOfMeans(draft),
            statementOfTruth: this.convertStatementOfTruth(draft)
        };
    }
    static convertPartAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft) {
        let amount;
        if (draft.partialAdmission.alreadyPaid.option === yesNoOption_1.YesNoOption.YES) {
            amount = draft.partialAdmission.howMuchHaveYouPaid.amount;
        }
        else {
            amount = draft.partialAdmission.howMuchDoYouOwe.amount;
        }
        return {
            responseType: responseType_1.ResponseType.PART_ADMISSION,
            responseMethod: responseMethod_1.ResponseMethod.DIGITAL,
            amount: amount,
            paymentDeclaration: draft.partialAdmission.howMuchHaveYouPaid.date
                && draft.partialAdmission.howMuchHaveYouPaid.text
                && {
                    paidDate: draft.partialAdmission.howMuchHaveYouPaid.date.asString(),
                    explanation: draft.partialAdmission.howMuchHaveYouPaid.text
                },
            defence: draft.partialAdmission.whyDoYouDisagree.text,
            timeline: {
                rows: draft.partialAdmission.timeline.getPopulatedRowsOnly(),
                comment: draft.partialAdmission.timeline.comment
            },
            evidence: {
                rows: evidenceConverter_1.convertEvidence(draft.partialAdmission.evidence),
                comment: draft.partialAdmission.evidence.comment
            },
            defendant: this.convertPartyDetails(draft.defendantDetails),
            paymentIntention: draft.partialAdmission.paymentIntention && this.convertPaymentIntention(draft.partialAdmission.paymentIntention),
            freeMediation: freeMediationUtil_1.FreeMediationUtil.getFreeMediation(mediationDraft),
            mediationPhoneNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
            mediationContactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
            statementOfMeans: this.convertStatementOfMeans(draft),
            statementOfTruth: this.convertStatementOfTruth(draft),
            directionsQuestionnaire: (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') &&
                claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
        };
    }
    static convertStatementOfMeans(draft) {
        return draft.statementOfMeans && {
            bankAccounts: draft.statementOfMeans.bankAccounts.getPopulatedRowsOnly().map((bankAccount) => {
                return {
                    type: bankAccount.typeOfAccount.value,
                    joint: bankAccount.joint,
                    balance: bankAccount.balance
                };
            }),
            residence: {
                type: draft.statementOfMeans.residence.type.value,
                otherDetail: draft.statementOfMeans.residence.housingDetails
            },
            dependant: draft.statementOfMeans.dependants.declared || draft.statementOfMeans.otherDependants.declared ? {
                children: draft.statementOfMeans.dependants.declared ? this.convertStatementOfMeansChildren(draft) : undefined,
                otherDependants: draft.statementOfMeans.otherDependants && draft.statementOfMeans.otherDependants.declared ? {
                    numberOfPeople: draft.statementOfMeans.otherDependants.numberOfPeople.value,
                    details: draft.statementOfMeans.otherDependants.numberOfPeople.details || undefined,
                    anyDisabled: draft.statementOfMeans.otherDependantsDisability && draft.statementOfMeans.otherDependantsDisability.option === otherDependantsDisability_1.OtherDependantsDisabilityOption.YES
                } : undefined,
                anyDisabledChildren: draft.statementOfMeans.dependantsDisability && draft.statementOfMeans.dependantsDisability.option === dependantsDisability_1.DependantsDisabilityOption.YES
            } : undefined,
            partner: draft.statementOfMeans.cohabiting.option === cohabiting_1.CohabitingOption.YES ? {
                over18: draft.statementOfMeans.partnerAge.option === partnerAge_1.PartnerAgeOption.YES,
                disability: this.inferPartnerDisabilityType(draft),
                pensioner: draft.statementOfMeans.partnerPension ? draft.statementOfMeans.partnerPension.option === partnerPension_1.PartnerPensionOption.YES : undefined
            } : undefined,
            disability: !draft.statementOfMeans.disability.option || draft.statementOfMeans.disability.option === disability_1.DisabilityOption.NO
                ? disabilityStatus_1.DisabilityStatus.NO
                : (!draft.statementOfMeans.severeDisability.option || draft.statementOfMeans.severeDisability.option === severeDisability_1.SevereDisabilityOption.NO
                    ? disabilityStatus_1.DisabilityStatus.YES
                    : disabilityStatus_1.DisabilityStatus.SEVERE),
            employment: {
                employers: draft.statementOfMeans.employment.employed ? draft.statementOfMeans.employers.getPopulatedRowsOnly().map((employer) => {
                    return {
                        jobTitle: employer.jobTitle,
                        name: employer.employerName
                    };
                }) : undefined,
                selfEmployment: draft.statementOfMeans.employment.selfEmployed ? {
                    jobTitle: draft.statementOfMeans.selfEmployment.jobTitle,
                    annualTurnover: draft.statementOfMeans.selfEmployment.annualTurnover,
                    onTaxPayments: draft.statementOfMeans.onTaxPayments.declared ? {
                        amountYouOwe: draft.statementOfMeans.onTaxPayments.amountYouOwe,
                        reason: draft.statementOfMeans.onTaxPayments.reason
                    } : undefined
                } : undefined,
                unemployment: !draft.statementOfMeans.employment.employed && !draft.statementOfMeans.employment.selfEmployed ? {
                    unemployed: draft.statementOfMeans.unemployment.option === unemploymentType_1.UnemploymentType.UNEMPLOYED ? {
                        numberOfMonths: draft.statementOfMeans.unemployment.unemploymentDetails.months,
                        numberOfYears: draft.statementOfMeans.unemployment.unemploymentDetails.years
                    } : undefined,
                    retired: draft.statementOfMeans.unemployment.option === unemploymentType_1.UnemploymentType.RETIRED,
                    other: draft.statementOfMeans.unemployment.option === unemploymentType_1.UnemploymentType.OTHER ? draft.statementOfMeans.unemployment.otherDetails.details : undefined
                } : undefined
            },
            debts: draft.statementOfMeans.debts.declared ? draft.statementOfMeans.debts.getPopulatedRowsOnly().map((debt) => {
                return {
                    description: debt.debt,
                    totalOwed: debt.totalOwed,
                    monthlyPayments: debt.monthlyPayments
                };
            }) : undefined,
            courtOrders: draft.statementOfMeans.courtOrders.declared ? draft.statementOfMeans.courtOrders.getPopulatedRowsOnly().map((courtOrder) => {
                return {
                    claimNumber: courtOrder.claimNumber,
                    amountOwed: courtOrder.amount,
                    monthlyInstalmentAmount: courtOrder.instalmentAmount
                };
            }) : undefined,
            reason: draft.statementOfMeans.explanation.text,
            incomes: this.convertIncomes(draft.statementOfMeans.monthlyIncome),
            expenses: this.convertExpenses(draft.statementOfMeans.monthlyExpenses),
            carer: draft.statementOfMeans.carer.option === carer_1.CarerOption.YES,
            priorityDebts: this.convertPriorityDebts(draft.statementOfMeans.priorityDebt)
        };
    }
    static convertStatementOfTruth(draft) {
        if (draft.qualifiedStatementOfTruth) {
            return new statementOfTruth_1.StatementOfTruth(draft.qualifiedStatementOfTruth.signerName, draft.qualifiedStatementOfTruth.signerRole);
        }
        return undefined;
    }
    // TODO A workaround for Claim Store staff notifications logic to work.
    // Should be removed once partial admission feature is fully done and frontend and backend models are aligned properly.
    static inferDefenceType(draft) {
        return draft.rejectAllOfClaim && draft.rejectAllOfClaim.option === rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID
            ? defenceType_1.DefenceType.ALREADY_PAID
            : defenceType_1.DefenceType.DISPUTE;
    }
    static inferPartnerDisabilityType(draft) {
        if (!draft.statementOfMeans.partnerDisability.option || draft.statementOfMeans.partnerDisability.option === partnerDisability_1.PartnerDisabilityOption.NO) {
            return disabilityStatus_1.DisabilityStatus.NO;
        }
        return (draft.statementOfMeans.partnerSevereDisability.option && draft.statementOfMeans.partnerSevereDisability.option === partnerSevereDisability_1.PartnerSevereDisabilityOption.YES)
            ? disabilityStatus_1.DisabilityStatus.SEVERE
            : disabilityStatus_1.DisabilityStatus.YES;
    }
    static convertPartyDetails(defendant) {
        let party = undefined;
        switch (defendant.partyDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                party = new individual_1.Individual();
                if (defendant.partyDetails.dateOfBirth) {
                    party.dateOfBirth = defendant.partyDetails.dateOfBirth.date.asString();
                }
                if (defendant.partyDetails.title) {
                    party.title = defendant.partyDetails.title;
                }
                if (defendant.partyDetails.firstName) {
                    party.firstName = defendant.partyDetails.firstName;
                }
                if (defendant.partyDetails.lastName) {
                    party.lastName = defendant.partyDetails.lastName;
                }
                break;
            case partyType_1.PartyType.COMPANY.value:
                party = new company_1.Company();
                if (defendant.partyDetails.contactPerson) {
                    party.contactPerson = defendant.partyDetails.contactPerson;
                }
                break;
            case partyType_1.PartyType.ORGANISATION.value:
                party = new organisation_1.Organisation();
                if (defendant.partyDetails.contactPerson) {
                    party.contactPerson = defendant.partyDetails.contactPerson;
                }
                break;
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                party = new soleTrader_1.SoleTrader();
                if (defendant.partyDetails.businessName) {
                    party.businessName = defendant.partyDetails.businessName;
                }
                if (defendant.partyDetails.title) {
                    party.title = defendant.partyDetails.title;
                }
                if (defendant.partyDetails.firstName) {
                    party.firstName = defendant.partyDetails.firstName;
                }
                if (defendant.partyDetails.lastName) {
                    party.lastName = defendant.partyDetails.lastName;
                }
                break;
        }
        party.address = new address_1.Address().deserialize(defendant.partyDetails.address);
        if (defendant.partyDetails.hasCorrespondenceAddress) {
            party.correspondenceAddress = new address_1.Address().deserialize(defendant.partyDetails.correspondenceAddress);
        }
        if (defendant.partyDetails.name) {
            party.name = defendant.partyDetails.name;
        }
        if (defendant.email) {
            party.email = defendant.email.address;
        }
        if (defendant.phone) {
            party.phone = defendant.phone.number;
        }
        return party;
    }
    static convertPaymentIntention(paymentIntention) {
        return {
            paymentOption: paymentIntention.paymentOption.option.value,
            paymentDate: this.convertPaymentDate(paymentIntention.paymentOption, paymentIntention.paymentDate),
            repaymentPlan: paymentIntention.paymentPlan && {
                instalmentAmount: paymentIntention.paymentPlan.instalmentAmount,
                firstPaymentDate: paymentIntention.paymentPlan.firstPaymentDate.toMoment(),
                paymentSchedule: paymentIntention.paymentPlan.paymentSchedule.value,
                completionDate: paymentIntention.paymentPlan.completionDate.toMoment(),
                paymentLength: paymentIntention.paymentPlan.paymentLength
            }
        };
    }
    static convertPaymentDate(paymentOption, paymentDate) {
        switch (paymentOption.option) {
            case paymentOption_1.PaymentType.IMMEDIATELY:
                return momentFactory_1.MomentFactory.currentDate().add(5, 'days');
            case paymentOption_1.PaymentType.BY_SET_DATE:
                return paymentDate.date.toMoment();
            default:
                return undefined;
        }
    }
    static convertStatementOfMeansChildren(draft) {
        if (!draft.statementOfMeans.dependants.declared) {
            return undefined;
        }
        const children = [];
        if (draft.statementOfMeans.dependants.numberOfChildren.under11) {
            children.push({
                ageGroupType: dependant_1.AgeGroupType.UNDER_11,
                numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.under11
            });
        }
        if (draft.statementOfMeans.dependants.numberOfChildren.between11and15) {
            children.push({
                ageGroupType: dependant_1.AgeGroupType.BETWEEN_11_AND_15,
                numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.between11and15
            });
        }
        if (draft.statementOfMeans.dependants.numberOfChildren.between16and19) {
            children.push({
                ageGroupType: dependant_1.AgeGroupType.BETWEEN_16_AND_19,
                numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.between16and19,
                numberOfChildrenLivingWithYou: draft.statementOfMeans.education ? draft.statementOfMeans.education.value : undefined
            });
        }
        return children;
    }
    static convertPriorityDebts(priorityDebt) {
        if (!priorityDebt) {
            return undefined;
        }
        const priorityDebts = [];
        if (priorityDebt.mortgage && priorityDebt.mortgage.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.MORTGAGE,
                frequency: priorityDebt.mortgage.schedule.value,
                amount: priorityDebt.mortgage.amount
            });
        }
        if (priorityDebt.rent && priorityDebt.rent.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.RENT,
                frequency: priorityDebt.rent.schedule.value,
                amount: priorityDebt.rent.amount
            });
        }
        if (priorityDebt.councilTax && priorityDebt.councilTax.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.COUNCIL_TAX,
                frequency: priorityDebt.councilTax.schedule.value,
                amount: priorityDebt.councilTax.amount
            });
        }
        if (priorityDebt.gas && priorityDebt.gas.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.GAS,
                frequency: priorityDebt.gas.schedule.value,
                amount: priorityDebt.gas.amount
            });
        }
        if (priorityDebt.electricity && priorityDebt.electricity.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.ELECTRICITY,
                frequency: priorityDebt.electricity.schedule.value,
                amount: priorityDebt.electricity.amount
            });
        }
        if (priorityDebt.water && priorityDebt.water.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.WATER,
                frequency: priorityDebt.water.schedule.value,
                amount: priorityDebt.water.amount
            });
        }
        if (priorityDebt.maintenance && priorityDebt.maintenance.populated) {
            priorityDebts.push({
                type: priorityDebts_1.PriorityDebtType.MAINTENANCE_PAYMENTS,
                frequency: priorityDebt.maintenance.schedule.value,
                amount: priorityDebt.maintenance.amount
            });
        }
        return priorityDebts;
    }
    static convertIncomes(income) {
        if (!income) {
            return undefined;
        }
        const incomes = [];
        if (income.salarySource && income.salarySource.populated) {
            incomes.push({
                type: income_1.IncomeType.JOB,
                frequency: income.salarySource.schedule.value,
                amount: income.salarySource.amount
            });
        }
        if (income.universalCreditSource && income.universalCreditSource.populated) {
            incomes.push({
                type: income_1.IncomeType.UNIVERSAL_CREDIT,
                frequency: income.universalCreditSource.schedule.value,
                amount: income.universalCreditSource.amount
            });
        }
        if (income.jobseekerAllowanceIncomeSource && income.jobseekerAllowanceIncomeSource.populated) {
            incomes.push({
                type: income_1.IncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES,
                frequency: income.jobseekerAllowanceIncomeSource.schedule.value,
                amount: income.jobseekerAllowanceIncomeSource.amount
            });
        }
        if (income.jobseekerAllowanceContributionSource && income.jobseekerAllowanceContributionSource.populated) {
            incomes.push({
                type: income_1.IncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED,
                frequency: income.jobseekerAllowanceContributionSource.schedule.value,
                amount: income.jobseekerAllowanceContributionSource.amount
            });
        }
        if (income.incomeSupportSource && income.incomeSupportSource.populated) {
            incomes.push({
                type: income_1.IncomeType.INCOME_SUPPORT,
                frequency: income.incomeSupportSource.schedule.value,
                amount: income.incomeSupportSource.amount
            });
        }
        if (income.workingTaxCreditSource && income.workingTaxCreditSource.populated) {
            incomes.push({
                type: income_1.IncomeType.WORKING_TAX_CREDIT,
                frequency: income.workingTaxCreditSource.schedule.value,
                amount: income.workingTaxCreditSource.amount
            });
        }
        if (income.childTaxCreditSource && income.childTaxCreditSource.populated) {
            incomes.push({
                type: income_1.IncomeType.CHILD_TAX_CREDIT,
                frequency: income.childTaxCreditSource.schedule.value,
                amount: income.childTaxCreditSource.amount
            });
        }
        if (income.childBenefitSource && income.childBenefitSource.populated) {
            incomes.push({
                type: income_1.IncomeType.CHILD_BENEFIT,
                frequency: income.childBenefitSource.schedule.value,
                amount: income.childBenefitSource.amount
            });
        }
        if (income.councilTaxSupportSource && income.councilTaxSupportSource.populated) {
            incomes.push({
                type: income_1.IncomeType.COUNCIL_TAX_SUPPORT,
                frequency: income.councilTaxSupportSource.schedule.value,
                amount: income.councilTaxSupportSource.amount
            });
        }
        if (income.pensionSource && income.pensionSource.populated) {
            incomes.push({
                type: income_1.IncomeType.PENSION,
                frequency: income.pensionSource.schedule.value,
                amount: income.pensionSource.amount
            });
        }
        if (income.otherSources && income.anyOtherIncomePopulated) {
            income.otherSources.map(source => {
                incomes.push({
                    type: income_1.IncomeType.OTHER,
                    frequency: source.schedule.value,
                    amount: source.amount,
                    otherSource: source.name
                });
            });
        }
        return incomes;
    }
    static convertExpenses(monthlyExpenses) {
        if (!monthlyExpenses) {
            return undefined;
        }
        const expenses = [];
        if (monthlyExpenses.mortgage && monthlyExpenses.mortgage.populated) {
            expenses.push({
                type: expense_1.ExpenseType.MORTGAGE,
                frequency: monthlyExpenses.mortgage.schedule.value,
                amount: monthlyExpenses.mortgage.amount
            });
        }
        if (monthlyExpenses.rent && monthlyExpenses.rent.populated) {
            expenses.push({
                type: expense_1.ExpenseType.RENT,
                frequency: monthlyExpenses.rent.schedule.value,
                amount: monthlyExpenses.rent.amount
            });
        }
        if (monthlyExpenses.councilTax && monthlyExpenses.councilTax.populated) {
            expenses.push({
                type: expense_1.ExpenseType.COUNCIL_TAX,
                frequency: monthlyExpenses.councilTax.schedule.value,
                amount: monthlyExpenses.councilTax.amount
            });
        }
        if (monthlyExpenses.gas && monthlyExpenses.gas.populated) {
            expenses.push({
                type: expense_1.ExpenseType.GAS,
                frequency: monthlyExpenses.gas.schedule.value,
                amount: monthlyExpenses.gas.amount
            });
        }
        if (monthlyExpenses.electricity && monthlyExpenses.electricity.populated) {
            expenses.push({
                type: expense_1.ExpenseType.ELECTRICITY,
                frequency: monthlyExpenses.electricity.schedule.value,
                amount: monthlyExpenses.electricity.amount
            });
        }
        if (monthlyExpenses.water && monthlyExpenses.water.populated) {
            expenses.push({
                type: expense_1.ExpenseType.WATER,
                frequency: monthlyExpenses.water.schedule.value,
                amount: monthlyExpenses.water.amount
            });
        }
        if (monthlyExpenses.travel && monthlyExpenses.travel.populated) {
            expenses.push({
                type: expense_1.ExpenseType.TRAVEL,
                frequency: monthlyExpenses.travel.schedule.value,
                amount: monthlyExpenses.travel.amount
            });
        }
        if (monthlyExpenses.schoolCosts && monthlyExpenses.schoolCosts.populated) {
            expenses.push({
                type: expense_1.ExpenseType.SCHOOL_COSTS,
                frequency: monthlyExpenses.schoolCosts.schedule.value,
                amount: monthlyExpenses.schoolCosts.amount
            });
        }
        if (monthlyExpenses.foodAndHousekeeping && monthlyExpenses.foodAndHousekeeping.populated) {
            expenses.push({
                type: expense_1.ExpenseType.FOOD_HOUSEKEEPING,
                frequency: monthlyExpenses.foodAndHousekeeping.schedule.value,
                amount: monthlyExpenses.foodAndHousekeeping.amount
            });
        }
        if (monthlyExpenses.tvAndBroadband && monthlyExpenses.tvAndBroadband.populated) {
            expenses.push({
                type: expense_1.ExpenseType.TV_AND_BROADBAND,
                frequency: monthlyExpenses.tvAndBroadband.schedule.value,
                amount: monthlyExpenses.tvAndBroadband.amount
            });
        }
        if (monthlyExpenses.hirePurchase && monthlyExpenses.hirePurchase.populated) {
            expenses.push({
                type: expense_1.ExpenseType.HIRE_PURCHASES,
                frequency: monthlyExpenses.hirePurchase.schedule.value,
                amount: monthlyExpenses.hirePurchase.amount
            });
        }
        if (monthlyExpenses.mobilePhone && monthlyExpenses.mobilePhone.populated) {
            expenses.push({
                type: expense_1.ExpenseType.MOBILE_PHONE,
                frequency: monthlyExpenses.mobilePhone.schedule.value,
                amount: monthlyExpenses.mobilePhone.amount
            });
        }
        if (monthlyExpenses.maintenance && monthlyExpenses.maintenance.populated) {
            expenses.push({
                type: expense_1.ExpenseType.MAINTENANCE_PAYMENTS,
                frequency: monthlyExpenses.maintenance.schedule.value,
                amount: monthlyExpenses.maintenance.amount
            });
        }
        if (monthlyExpenses.other && monthlyExpenses.anyOtherPopulated) {
            monthlyExpenses.other.map(source => {
                expenses.push({
                    type: expense_1.ExpenseType.OTHER,
                    frequency: source.schedule.value,
                    amount: source.amount,
                    otherName: source.name
                });
            });
        }
        return expenses;
    }
    static convertDirectionsQuestionnaire(directionsQuestionnaireDraft) {
        return directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraft);
    }
}
exports.ResponseModelConverter = ResponseModelConverter;
