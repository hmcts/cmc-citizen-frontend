import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { DefenceType } from 'claims/models/response/defenceType'
import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { AgeGroupType, Child } from 'claims/models/response/statement-of-means/dependant'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { Moment } from 'moment'
import { FullAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans as StatementOfMeansDraft } from 'response/draft/statementOfMeans'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { FullAdmissionResponse } from 'claims/models/response/fullDefenceAdmission'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { PartyType } from 'common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Party } from 'claims/models/details/yours/party'
import { Individual } from 'claims/models/details/yours/individual'
import { Company } from 'claims/models/details/yours/company'
import { Address } from 'claims/models/address'
import { Organisation } from 'claims/models/details/yours/organisation'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Defendant } from 'drafts/models/defendant'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { ResponseType as FormResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'
import { CourtOrderRow } from 'response/form/models/statement-of-means/courtOrderRow'
import { DebtRow } from 'response/form/models/statement-of-means/debtRow'
import { EmployerRow } from 'response/form/models/statement-of-means/employerRow'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { WhenDidYouPay } from 'response/form/models/whenDidYouPay'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { convertEvidence } from 'claims/converters/evidenceConverter'
import { MomentFactory } from 'shared/momentFactory'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

export class ResponseModelConverter {

  static convert (draft: ResponseDraft): Response {
    switch (draft.response.type) {
      case FormResponseType.DEFENCE:
        return this.convertFullDefence(draft)
      case FormResponseType.FULL_ADMISSION:
        return this.convertFullAdmission(draft)
      default:
        throw new Error(`Unsupported response type: ${draft.response.type.value}`)
    }
  }

  private static convertFullDefence (draft: ResponseDraft): FullDefenceResponse {
    let paymentDeclaration: PaymentDeclaration = undefined
    if (draft.isResponseRejectedFullyWithAmountClaimedPaid()) {
      paymentDeclaration = this.convertWhenDidYouPay(draft.whenDidYouPay)
    }

    return {
      responseType: ResponseType.FULL_DEFENCE,
      defendant: this.convertPartyDetails(draft.defendantDetails),
      defenceType: this.inferDefenceType(draft),
      defence: draft.defence.text,
      timeline: {
        rows: draft.timeline.getPopulatedRowsOnly(),
        comment: draft.timeline.comment
      } as DefendantTimeline,
      evidence: {
        rows: convertEvidence(draft.evidence) as any,
        comment: draft.evidence.comment
      } as DefendantEvidence,
      freeMediation: draft.freeMediation && draft.freeMediation.option as YesNoOption,
      paymentDeclaration,
      statementOfTruth: this.convertStatementOfTruth(draft)
    }
  }

  private static convertFullAdmission (draft: ResponseDraft): FullAdmissionResponse {
    return {
      responseType: ResponseType.FULL_ADMISSION,
      defendant: this.convertPartyDetails(draft.defendantDetails),
      paymentOption: draft.fullAdmission.paymentOption.option.value as PaymentOption,
      paymentDate: this.convertPaymentDate(draft.fullAdmission),
      repaymentPlan: draft.fullAdmission.paymentPlan && {
        instalmentAmount: draft.fullAdmission.paymentPlan.instalmentAmount,
        firstPaymentDate: draft.fullAdmission.paymentPlan.firstPaymentDate.toMoment(),
        paymentSchedule: draft.fullAdmission.paymentPlan.paymentSchedule.value as PaymentSchedule
      },
      statementOfMeans: this.convertStatementOfMeans(draft),
      statementOfTruth: this.convertStatementOfTruth(draft)
    }
  }

  private static convertStatementOfMeans (draft: ResponseDraft): StatementOfMeans {
    return draft.statementOfMeans && {
      bankAccounts: draft.statementOfMeans.bankAccounts.getPopulatedRowsOnly().map((bankAccount: BankAccountRow) => {
        return {
          type: bankAccount.typeOfAccount.value as BankAccountType,
          joint: bankAccount.joint,
          balance: bankAccount.balance
        }
      }),
      residence: {
        type: draft.statementOfMeans.residence.type.value as ResidenceType,
        otherDetail: draft.statementOfMeans.residence.housingDetails
      },
      dependant: draft.statementOfMeans.dependants.declared || draft.statementOfMeans.maintenance.declared || draft.statementOfMeans.otherDependants.declared ? {
        children: draft.statementOfMeans.dependants.declared ? this.convertStatementOfMeansChildren(draft) : undefined,
        numberOfMaintainedChildren: draft.statementOfMeans.maintenance.declared ? draft.statementOfMeans.maintenance.value : undefined,
        otherDependants: draft.statementOfMeans.otherDependants.declared ? undefined : undefined
      } : undefined,
      employment: {
        employers: draft.statementOfMeans.employment.employed ? draft.statementOfMeans.employers.getPopulatedRowsOnly().map((employer: EmployerRow) => {
          return {
            jobTitle: employer.jobTitle,
            name: employer.employerName
          }
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
          unemployed: draft.statementOfMeans.unemployment.option === UnemploymentType.UNEMPLOYED ? {
            numberOfMonths: draft.statementOfMeans.unemployment.unemploymentDetails.months,
            numberOfYears: draft.statementOfMeans.unemployment.unemploymentDetails.years
          } : undefined,
          retired: draft.statementOfMeans.unemployment.option === UnemploymentType.RETIRED,
          other: draft.statementOfMeans.unemployment.option === UnemploymentType.OTHER ? draft.statementOfMeans.unemployment.otherDetails.details : undefined
        } : undefined
      },
      debts: draft.statementOfMeans.debts.declared ? draft.statementOfMeans.debts.getPopulatedRowsOnly().map((debt: DebtRow) => {
        return {
          description: debt.debt,
          totalOwed: debt.totalOwed,
          monthlyPayments: debt.monthlyPayments
        }
      }) : undefined,
      courtOrders: draft.statementOfMeans.courtOrders.declared ? draft.statementOfMeans.courtOrders.getPopulatedRowsOnly().map((courtOrder: CourtOrderRow) => {
        return {
          claimNumber: courtOrder.claimNumber,
          amountOwed: courtOrder.amount,
          monthlyInstalmentAmount: courtOrder.instalmentAmount
        }
      }) : undefined,
      reason: draft.statementOfMeans.explanation.text,
      incomes: this.convertIncomes(draft)
    }
  }

  private static convertStatementOfTruth (draft: ResponseDraft): StatementOfTruth {
    if (draft.qualifiedStatementOfTruth) {
      return new StatementOfTruth(
        draft.qualifiedStatementOfTruth.signerName,
        draft.qualifiedStatementOfTruth.signerRole
      )
    }

    return undefined
  }

  // TODO A workaround for Claim Store staff notifications logic to work.
  // Should be removed once partial admission feature is fully done and frontend and backend models are aligned properly.
  private static inferDefenceType (draft: ResponseDraft): DefenceType {
    return draft.rejectAllOfClaim && draft.rejectAllOfClaim.option === RejectAllOfClaimOption.ALREADY_PAID
      ? DefenceType.ALREADY_PAID
      : DefenceType.DISPUTE
  }

  private static convertPartyDetails (defendant: Defendant): Party {
    let party: Party = undefined
    switch (defendant.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        party = new Individual()
        if ((defendant.partyDetails as IndividualDetails).dateOfBirth) {
          (party as Individual).dateOfBirth = (defendant.partyDetails as IndividualDetails).dateOfBirth.date.asString()
        }
        break
      case PartyType.COMPANY.value:
        party = new Company()
        if ((defendant.partyDetails as CompanyDetails).contactPerson) {
          (party as Company).contactPerson = (defendant.partyDetails as CompanyDetails).contactPerson
        }
        break
      case PartyType.ORGANISATION.value:
        party = new Organisation()
        if ((defendant.partyDetails as OrganisationDetails).contactPerson) {
          (party as Organisation).contactPerson = (defendant.partyDetails as OrganisationDetails).contactPerson
        }
        break
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        party = new SoleTrader()
        if ((defendant.partyDetails as SoleTraderDetails).businessName) {
          (party as SoleTrader).businessName = (defendant.partyDetails as SoleTraderDetails).businessName
        }
        break
    }
    party.address = new Address().deserialize(defendant.partyDetails.address)
    if (defendant.partyDetails.hasCorrespondenceAddress) {
      party.correspondenceAddress = new Address().deserialize(defendant.partyDetails.correspondenceAddress)
    }
    party.name = defendant.partyDetails.name
    if (defendant.email) {
      party.email = defendant.email.address
    }
    if (defendant.mobilePhone) {
      party.mobilePhone = defendant.mobilePhone.number
    }
    return party
  }

  private static convertPaymentDate (fullAdmission: FullAdmission): Moment {
    switch (fullAdmission.paymentOption.option) {
      case DefendantPaymentType.IMMEDIATELY:
        return MomentFactory.currentDate().add(5, 'days')
      case DefendantPaymentType.BY_SET_DATE:
        return fullAdmission.paymentDate.date.toMoment()
      default:
        return undefined
    }
  }

  private static convertWhenDidYouPay (whenDidYouPay: WhenDidYouPay): PaymentDeclaration {
    if (whenDidYouPay === undefined) {
      return undefined
    }
    return new PaymentDeclaration(whenDidYouPay.date.asString(), whenDidYouPay.text)
  }

  private static convertStatementOfMeansChildren (draft: ResponseDraft): Child[] {
    if (!draft.statementOfMeans.dependants.declared) {
      return undefined
    }

    const children: Child[] = []
    if (draft.statementOfMeans.dependants.numberOfChildren.under11) {
      children.push({
        ageGroupType: AgeGroupType.UNDER_11,
        numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.under11
      })
    }
    if (draft.statementOfMeans.dependants.numberOfChildren.between11and15) {
      children.push({
        ageGroupType: AgeGroupType.BETWEEN_11_AND_15,
        numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.between11and15
      })
    }
    if (draft.statementOfMeans.dependants.numberOfChildren.between16and19) {
      children.push({
        ageGroupType: AgeGroupType.BETWEEN_16_AND_19,
        numberOfChildren: draft.statementOfMeans.dependants.numberOfChildren.between16and19,
        numberOfChildrenLivingWithYou: draft.statementOfMeans.education ? draft.statementOfMeans.education.value : undefined
      })
    }
    return children
  }

  private static convertIncomes (statementOfMeans: StatementOfMeansDraft): Income[] {
    if (!statementOfMeans.monthlyIncome) {
      return undefined
    }
    const incomes: Income[] = []
    if (statementOfMeans.monthlyIncome.salarySource.populated) {
      incomes.push({
        type: IncomeType.JOB,
        frequency: statementOfMeans.monthlyIncome.salarySource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.salarySource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.universalCreditSource.populated) {
      incomes.push({
        type: IncomeType.UNIVERSAL_CREDIT,
        frequency: statementOfMeans.monthlyIncome.universalCreditSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.universalCreditSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.jobseekerAllowanceIncomeSource.populated) {
      incomes.push({
        type: IncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES,
        frequency: statementOfMeans.monthlyIncome.jobseekerAllowanceIncomeSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.jobseekerAllowanceIncomeSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.jobseekerAllowanceContributionSource.populated) {
      incomes.push({
        type: IncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED,
        frequency: statementOfMeans.monthlyIncome.jobseekerAllowanceContributionSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.jobseekerAllowanceContributionSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.incomeSupportSource.populated) {
      incomes.push({
        type: IncomeType.INCOME_SUPPORT,
        frequency: statementOfMeans.monthlyIncome.incomeSupportSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.incomeSupportSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.workingTaxCreditSource.populated) {
      incomes.push({
        type: IncomeType.WORKING_TAX_CREDIT,
        frequency: statementOfMeans.monthlyIncome.workingTaxCreditSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.workingTaxCreditSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.childTaxCreditSource.populated) {
      incomes.push({
        type: IncomeType.CHILD_TAX_CREDIT,
        frequency: statementOfMeans.monthlyIncome.childTaxCreditSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.childTaxCreditSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.childBenefitSource.populated) {
      incomes.push({
        type: IncomeType.CHILD_BENEFIT,
        frequency: statementOfMeans.monthlyIncome.childBenefitSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.childBenefitSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.councilTaxSupportSource.populated) {
      incomes.push({
        type: IncomeType.COUNCIL_TAX_SUPPORT,
        frequency: statementOfMeans.monthlyIncome.councilTaxSupportSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.councilTaxSupportSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.pensionSource.populated) {
      incomes.push({
        type: IncomeType.PENSION,
        frequency: statementOfMeans.monthlyIncome.pensionSource.schedule.value as PaymentFrequency,
        amountReceived: statementOfMeans.monthlyIncome.pensionSource.amount,
        otherSource: undefined
      })
    }
    if (statementOfMeans.monthlyIncome.anyOtherIncomePopulated) {
      statementOfMeans.monthlyIncome.otherSources.map(source => {
        incomes.push({
          type: IncomeType.OTHER,
          frequency: source.schedule.value as PaymentFrequency,
          amountReceived: source.amount,
          otherSource: source.name
        })
      })
    }
    return incomes
  }
}
