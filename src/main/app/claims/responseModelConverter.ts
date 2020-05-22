import { DefenceType } from 'claims/models/response/defenceType'
import { PaymentOption } from 'claims/models/paymentOption'
import {
  PaymentOption as PaymentOptionDraft,
  PaymentType
} from 'shared/components/payment-intention/model/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'
import { AgeGroupType, Child } from 'claims/models/response/statement-of-means/dependant'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { Moment } from 'moment'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
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
import { ResponseType as FormResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'
import { CourtOrderRow } from 'response/form/models/statement-of-means/courtOrderRow'
import { DebtRow } from 'response/form/models/statement-of-means/debtRow'
import { EmployerRow } from 'response/form/models/statement-of-means/employerRow'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { convertEvidence } from 'claims/converters/evidenceConverter'
import { MomentFactory } from 'shared/momentFactory'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { Expense, ExpenseType } from 'claims/models/response/statement-of-means/expense'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { YesNoOption as DraftYesNoOption } from 'models/yesNoOption'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentIntention as PaymentIntentionDraft } from 'shared/components/payment-intention/model/paymentIntention'
import { Claim } from 'claims/models/claim'
import { PriorityDebt as PriorityDebtDraft } from 'response/form/models/statement-of-means/priorityDebt'
import { PriorityDebts, PriorityDebtType } from 'claims/models/response/statement-of-means/priorityDebts'
import { DependantsDisabilityOption } from 'response/form/models/statement-of-means/dependantsDisability'
import { OtherDependantsDisabilityOption } from 'response/form/models/statement-of-means/otherDependantsDisability'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { PartnerAgeOption } from 'response/form/models/statement-of-means/partnerAge'
import { PartnerPensionOption } from 'response/form/models/statement-of-means/partnerPension'
import { PartnerDisabilityOption } from 'response/form/models/statement-of-means/partnerDisability'
import { PartnerSevereDisabilityOption } from 'response/form/models/statement-of-means/partnerSevereDisability'
import { CarerOption } from 'response/form/models/statement-of-means/carer'
import { CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'
import { DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { SevereDisabilityOption } from 'response/form/models/statement-of-means/severeDisability'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { ResponseMethod } from 'claims/models/response/responseMethod'

export class ResponseModelConverter {

  static convert (draft: ResponseDraft, mediationDraft: MediationDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft, claim: Claim): Response {
    switch (draft.response.type) {
      case FormResponseType.DEFENCE:
        if (draft.isResponseRejectedFullyBecausePaidWhatOwed()
          && draft.rejectAllOfClaim.howMuchHaveYouPaid.amount < claim.totalAmountTillToday) {
          return this.convertFullDefenceAsPartialAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft)
        }
        return this.convertFullDefence(draft, claim, mediationDraft, directionsQuestionnaireDraft)
      case FormResponseType.FULL_ADMISSION:
        return this.convertFullAdmission(draft, claim, mediationDraft)
      case FormResponseType.PART_ADMISSION:
        return this.convertPartAdmission(draft, claim, mediationDraft, directionsQuestionnaireDraft)
      default:
        throw new Error(`Unsupported response type: ${draft.response.type.value}`)
    }
  }

  private static convertFullDefence (draft: ResponseDraft, claim: Claim, mediationDraft: MediationDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): FullDefenceResponse {
    return {
      responseType: ResponseType.FULL_DEFENCE,
      responseMethod: ResponseMethod.DIGITAL,
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
      freeMediation: FreeMediationUtil.getFreeMediation(mediationDraft),
      mediationPhoneNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
      mediationContactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
      paymentDeclaration: draft.isResponseRejectedFullyBecausePaidWhatOwed() ? new PaymentDeclaration(
        draft.rejectAllOfClaim.howMuchHaveYouPaid.date.asString(),
        draft.rejectAllOfClaim.howMuchHaveYouPaid.amount,
        draft.rejectAllOfClaim.howMuchHaveYouPaid.text
      ) : undefined,
      statementOfTruth: this.convertStatementOfTruth(draft),
      directionsQuestionnaire: (FeatureToggles.isEnabled('directionsQuestionnaire') &&
        ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
    }
  }

  private static convertFullDefenceAsPartialAdmission (draft: ResponseDraft, claim: Claim, mediationDraft: MediationDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): PartialAdmissionResponse {
    return {
      responseType: ResponseType.PART_ADMISSION,
      responseMethod: ResponseMethod.DIGITAL,
      amount: draft.rejectAllOfClaim.howMuchHaveYouPaid.amount,
      paymentDeclaration: {
        paidDate: draft.rejectAllOfClaim.howMuchHaveYouPaid.date.asString(),
        explanation: draft.rejectAllOfClaim.howMuchHaveYouPaid.text
      } as PaymentDeclaration,
      defence: draft.rejectAllOfClaim.whyDoYouDisagree.text,
      timeline: {
        rows: draft.timeline.getPopulatedRowsOnly(),
        comment: draft.timeline.comment
      } as DefendantTimeline,
      evidence: {
        rows: convertEvidence(draft.evidence) as any,
        comment: draft.evidence.comment
      } as DefendantEvidence,
      freeMediation: FreeMediationUtil.getFreeMediation(mediationDraft),
      mediationPhoneNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
      mediationContactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
      defendant: this.convertPartyDetails(draft.defendantDetails),
      statementOfTruth: this.convertStatementOfTruth(draft),
      directionsQuestionnaire: (FeatureToggles.isEnabled('directionsQuestionnaire') &&
        ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
    }
  }

  private static convertFullAdmission (draft: ResponseDraft, claim: Claim, mediationDraft: MediationDraft): FullAdmissionResponse {
    return {
      responseType: ResponseType.FULL_ADMISSION,
      responseMethod: ResponseMethod.DIGITAL,
      freeMediation: FreeMediationUtil.getFreeMediation(mediationDraft),
      mediationPhoneNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
      mediationContactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
      defendant: this.convertPartyDetails(draft.defendantDetails),
      paymentIntention: this.convertPaymentIntention(draft.fullAdmission.paymentIntention),
      statementOfMeans: this.convertStatementOfMeans(draft),
      statementOfTruth: this.convertStatementOfTruth(draft)
    }
  }

  private static convertPartAdmission (draft: ResponseDraft, claim: Claim, mediationDraft: MediationDraft, directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): PartialAdmissionResponse {
    let amount
    if (draft.partialAdmission.alreadyPaid.option === DraftYesNoOption.YES) {
      amount = draft.partialAdmission.howMuchHaveYouPaid.amount
    } else {
      amount = draft.partialAdmission.howMuchDoYouOwe.amount
    }

    return {
      responseType: ResponseType.PART_ADMISSION,
      amount: amount,
      paymentDeclaration: draft.partialAdmission.howMuchHaveYouPaid.date
        && draft.partialAdmission.howMuchHaveYouPaid.text
        && {
          paidDate: draft.partialAdmission.howMuchHaveYouPaid.date.asString(),
          explanation: draft.partialAdmission.howMuchHaveYouPaid.text
        } as PaymentDeclaration,
      defence: draft.partialAdmission.whyDoYouDisagree.text,
      timeline: {
        rows: draft.partialAdmission.timeline.getPopulatedRowsOnly(),
        comment: draft.partialAdmission.timeline.comment
      } as DefendantTimeline,
      evidence: {
        rows: convertEvidence(draft.partialAdmission.evidence) as any,
        comment: draft.partialAdmission.evidence.comment
      } as DefendantEvidence,
      defendant: this.convertPartyDetails(draft.defendantDetails),
      paymentIntention: draft.partialAdmission.paymentIntention && this.convertPaymentIntention(draft.partialAdmission.paymentIntention),
      freeMediation: FreeMediationUtil.getFreeMediation(mediationDraft),
      mediationPhoneNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft, draft),
      mediationContactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, draft),
      statementOfMeans: this.convertStatementOfMeans(draft),
      statementOfTruth: this.convertStatementOfTruth(draft),
      directionsQuestionnaire: (FeatureToggles.isEnabled('directionsQuestionnaire') &&
        ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) ? this.convertDirectionsQuestionnaire(directionsQuestionnaireDraft) : undefined
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
      dependant: draft.statementOfMeans.dependants.declared || draft.statementOfMeans.otherDependants.declared ? {
        children: draft.statementOfMeans.dependants.declared ? this.convertStatementOfMeansChildren(draft) : undefined,
        otherDependants: draft.statementOfMeans.otherDependants && draft.statementOfMeans.otherDependants.declared ? {
          numberOfPeople: draft.statementOfMeans.otherDependants.numberOfPeople.value,
          details: draft.statementOfMeans.otherDependants.numberOfPeople.details || undefined,
          anyDisabled: draft.statementOfMeans.otherDependantsDisability && draft.statementOfMeans.otherDependantsDisability.option === OtherDependantsDisabilityOption.YES
        } : undefined,
        anyDisabledChildren: draft.statementOfMeans.dependantsDisability && draft.statementOfMeans.dependantsDisability.option === DependantsDisabilityOption.YES
      } : undefined,
      partner: draft.statementOfMeans.cohabiting.option === CohabitingOption.YES ? {
        over18: draft.statementOfMeans.partnerAge.option === PartnerAgeOption.YES,
        disability: this.inferPartnerDisabilityType(draft),
        pensioner: draft.statementOfMeans.partnerPension ? draft.statementOfMeans.partnerPension.option === PartnerPensionOption.YES : undefined
      } : undefined,
      disability: !draft.statementOfMeans.disability.option || draft.statementOfMeans.disability.option === DisabilityOption.NO
        ? DisabilityStatus.NO
        : (!draft.statementOfMeans.severeDisability.option || draft.statementOfMeans.severeDisability.option === SevereDisabilityOption.NO
            ? DisabilityStatus.YES
            : DisabilityStatus.SEVERE
        ),
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
      incomes: this.convertIncomes(draft.statementOfMeans.monthlyIncome),
      expenses: this.convertExpenses(draft.statementOfMeans.monthlyExpenses),
      carer: draft.statementOfMeans.carer.option === CarerOption.YES,
      priorityDebts: this.convertPriorityDebts(draft.statementOfMeans.priorityDebt)
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

  private static inferPartnerDisabilityType (draft: ResponseDraft): DisabilityStatus {
    if (!draft.statementOfMeans.partnerDisability.option || draft.statementOfMeans.partnerDisability.option === PartnerDisabilityOption.NO) {
      return DisabilityStatus.NO
    }
    return (draft.statementOfMeans.partnerSevereDisability.option && draft.statementOfMeans.partnerSevereDisability.option === PartnerSevereDisabilityOption.YES)
      ? DisabilityStatus.SEVERE
      : DisabilityStatus.YES
  }

  private static convertPartyDetails (defendant: Defendant): Party {
    let party: Party = undefined
    switch (defendant.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        party = new Individual()
        if ((defendant.partyDetails as IndividualDetails).dateOfBirth) {
          (party as Individual).dateOfBirth = (defendant.partyDetails as IndividualDetails).dateOfBirth.date.asString()
        }
        if ((defendant.partyDetails as IndividualDetails).title) {
          (party as Individual).title = (defendant.partyDetails as IndividualDetails).title
        }
        if ((defendant.partyDetails as IndividualDetails).firstName) {
          (party as Individual).firstName = (defendant.partyDetails as IndividualDetails).firstName
        }
        if ((defendant.partyDetails as IndividualDetails).lastName) {
          (party as Individual).lastName = (defendant.partyDetails as IndividualDetails).lastName
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

        if ((defendant.partyDetails as SoleTraderDetails).title) {
          (party as SoleTrader).title = (defendant.partyDetails as SoleTraderDetails).title
        }
        if ((defendant.partyDetails as SoleTraderDetails).firstName) {
          (party as SoleTrader).firstName = (defendant.partyDetails as SoleTraderDetails).firstName
        }
        if ((defendant.partyDetails as SoleTraderDetails).lastName) {
          (party as SoleTrader).lastName = (defendant.partyDetails as SoleTraderDetails).lastName
        }
        break
    }
    party.address = new Address().deserialize(defendant.partyDetails.address)
    if (defendant.partyDetails.hasCorrespondenceAddress) {
      party.correspondenceAddress = new Address().deserialize(defendant.partyDetails.correspondenceAddress)
    }
    if (defendant.partyDetails.name) {
      party.name = defendant.partyDetails.name
    }

    if (defendant.email) {
      party.email = defendant.email.address
    }
    if (defendant.phone) {
      party.phone = defendant.phone.number
    }
    return party
  }

  private static convertPaymentIntention (paymentIntention: PaymentIntentionDraft): PaymentIntention {
    return {
      paymentOption: paymentIntention.paymentOption.option.value as PaymentOption,
      paymentDate: this.convertPaymentDate(paymentIntention.paymentOption, paymentIntention.paymentDate),
      repaymentPlan: paymentIntention.paymentPlan && {
        instalmentAmount: paymentIntention.paymentPlan.instalmentAmount,
        firstPaymentDate: paymentIntention.paymentPlan.firstPaymentDate.toMoment(),
        paymentSchedule: paymentIntention.paymentPlan.paymentSchedule.value as PaymentSchedule,
        completionDate: paymentIntention.paymentPlan.completionDate.toMoment(),
        paymentLength: paymentIntention.paymentPlan.paymentLength
      }
    } as PaymentIntention
  }

  private static convertPaymentDate (paymentOption: PaymentOptionDraft, paymentDate: PaymentDate): Moment {
    switch (paymentOption.option) {
      case PaymentType.IMMEDIATELY:
        return MomentFactory.currentDate().add(5, 'days')
      case PaymentType.BY_SET_DATE:
        return paymentDate.date.toMoment()
      default:
        return undefined
    }
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

  private static convertPriorityDebts (priorityDebt: PriorityDebtDraft | undefined): PriorityDebts[] {
    if (!priorityDebt) {
      return undefined
    }

    const priorityDebts: PriorityDebts[] = []
    if (priorityDebt.mortgage && priorityDebt.mortgage.populated) {
      priorityDebts.push({
        type: PriorityDebtType.MORTGAGE,
        frequency: priorityDebt.mortgage.schedule.value as PaymentFrequency,
        amount: priorityDebt.mortgage.amount
      })
    }
    if (priorityDebt.rent && priorityDebt.rent.populated) {
      priorityDebts.push({
        type: PriorityDebtType.RENT,
        frequency: priorityDebt.rent.schedule.value as PaymentFrequency,
        amount: priorityDebt.rent.amount
      })
    }
    if (priorityDebt.councilTax && priorityDebt.councilTax.populated) {
      priorityDebts.push({
        type: PriorityDebtType.COUNCIL_TAX,
        frequency: priorityDebt.councilTax.schedule.value as PaymentFrequency,
        amount: priorityDebt.councilTax.amount
      })
    }
    if (priorityDebt.gas && priorityDebt.gas.populated) {
      priorityDebts.push({
        type: PriorityDebtType.GAS,
        frequency: priorityDebt.gas.schedule.value as PaymentFrequency,
        amount: priorityDebt.gas.amount
      })
    }
    if (priorityDebt.electricity && priorityDebt.electricity.populated) {
      priorityDebts.push({
        type: PriorityDebtType.ELECTRICITY,
        frequency: priorityDebt.electricity.schedule.value as PaymentFrequency,
        amount: priorityDebt.electricity.amount
      })
    }
    if (priorityDebt.water && priorityDebt.water.populated) {
      priorityDebts.push({
        type: PriorityDebtType.WATER,
        frequency: priorityDebt.water.schedule.value as PaymentFrequency,
        amount: priorityDebt.water.amount
      })
    }
    if (priorityDebt.maintenance && priorityDebt.maintenance.populated) {
      priorityDebts.push({
        type: PriorityDebtType.MAINTENANCE_PAYMENTS,
        frequency: priorityDebt.maintenance.schedule.value as PaymentFrequency,
        amount: priorityDebt.maintenance.amount
      })
    }

    return priorityDebts

  }

  private static convertIncomes (income: MonthlyIncome | undefined): Income[] {
    if (!income) {
      return undefined
    }
    const incomes: Income[] = []
    if (income.salarySource && income.salarySource.populated) {
      incomes.push({
        type: IncomeType.JOB,
        frequency: income.salarySource.schedule.value as PaymentFrequency,
        amount: income.salarySource.amount
      })
    }
    if (income.universalCreditSource && income.universalCreditSource.populated) {
      incomes.push({
        type: IncomeType.UNIVERSAL_CREDIT,
        frequency: income.universalCreditSource.schedule.value as PaymentFrequency,
        amount: income.universalCreditSource.amount
      })
    }
    if (income.jobseekerAllowanceIncomeSource && income.jobseekerAllowanceIncomeSource.populated) {
      incomes.push({
        type: IncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES,
        frequency: income.jobseekerAllowanceIncomeSource.schedule.value as PaymentFrequency,
        amount: income.jobseekerAllowanceIncomeSource.amount
      })
    }
    if (income.jobseekerAllowanceContributionSource && income.jobseekerAllowanceContributionSource.populated) {
      incomes.push({
        type: IncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED,
        frequency: income.jobseekerAllowanceContributionSource.schedule.value as PaymentFrequency,
        amount: income.jobseekerAllowanceContributionSource.amount
      })
    }
    if (income.incomeSupportSource && income.incomeSupportSource.populated) {
      incomes.push({
        type: IncomeType.INCOME_SUPPORT,
        frequency: income.incomeSupportSource.schedule.value as PaymentFrequency,
        amount: income.incomeSupportSource.amount
      })
    }
    if (income.workingTaxCreditSource && income.workingTaxCreditSource.populated) {
      incomes.push({
        type: IncomeType.WORKING_TAX_CREDIT,
        frequency: income.workingTaxCreditSource.schedule.value as PaymentFrequency,
        amount: income.workingTaxCreditSource.amount
      })
    }
    if (income.childTaxCreditSource && income.childTaxCreditSource.populated) {
      incomes.push({
        type: IncomeType.CHILD_TAX_CREDIT,
        frequency: income.childTaxCreditSource.schedule.value as PaymentFrequency,
        amount: income.childTaxCreditSource.amount
      })
    }
    if (income.childBenefitSource && income.childBenefitSource.populated) {
      incomes.push({
        type: IncomeType.CHILD_BENEFIT,
        frequency: income.childBenefitSource.schedule.value as PaymentFrequency,
        amount: income.childBenefitSource.amount
      })
    }
    if (income.councilTaxSupportSource && income.councilTaxSupportSource.populated) {
      incomes.push({
        type: IncomeType.COUNCIL_TAX_SUPPORT,
        frequency: income.councilTaxSupportSource.schedule.value as PaymentFrequency,
        amount: income.councilTaxSupportSource.amount
      })
    }
    if (income.pensionSource && income.pensionSource.populated) {
      incomes.push({
        type: IncomeType.PENSION,
        frequency: income.pensionSource.schedule.value as PaymentFrequency,
        amount: income.pensionSource.amount
      })
    }
    if (income.otherSources && income.anyOtherIncomePopulated) {
      income.otherSources.map(source => {
        incomes.push({
          type: IncomeType.OTHER,
          frequency: source.schedule.value as PaymentFrequency,
          amount: source.amount,
          otherSource: source.name
        })
      })
    }
    return incomes
  }

  private static convertExpenses (monthlyExpenses: MonthlyExpenses | undefined): Expense[] {
    if (!monthlyExpenses) {
      return undefined
    }

    const expenses: Expense[] = []

    if (monthlyExpenses.mortgage && monthlyExpenses.mortgage.populated) {
      expenses.push({
        type: ExpenseType.MORTGAGE,
        frequency: monthlyExpenses.mortgage.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.mortgage.amount
      })
    }

    if (monthlyExpenses.rent && monthlyExpenses.rent.populated) {
      expenses.push({
        type: ExpenseType.RENT,
        frequency: monthlyExpenses.rent.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.rent.amount
      })
    }

    if (monthlyExpenses.councilTax && monthlyExpenses.councilTax.populated) {
      expenses.push({
        type: ExpenseType.COUNCIL_TAX,
        frequency: monthlyExpenses.councilTax.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.councilTax.amount
      })
    }

    if (monthlyExpenses.gas && monthlyExpenses.gas.populated) {
      expenses.push({
        type: ExpenseType.GAS,
        frequency: monthlyExpenses.gas.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.gas.amount
      })
    }

    if (monthlyExpenses.electricity && monthlyExpenses.electricity.populated) {
      expenses.push({
        type: ExpenseType.ELECTRICITY,
        frequency: monthlyExpenses.electricity.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.electricity.amount
      })
    }

    if (monthlyExpenses.water && monthlyExpenses.water.populated) {
      expenses.push({
        type: ExpenseType.WATER,
        frequency: monthlyExpenses.water.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.water.amount
      })
    }

    if (monthlyExpenses.travel && monthlyExpenses.travel.populated) {
      expenses.push({
        type: ExpenseType.TRAVEL,
        frequency: monthlyExpenses.travel.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.travel.amount
      })
    }

    if (monthlyExpenses.schoolCosts && monthlyExpenses.schoolCosts.populated) {
      expenses.push({
        type: ExpenseType.SCHOOL_COSTS,
        frequency: monthlyExpenses.schoolCosts.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.schoolCosts.amount
      })
    }

    if (monthlyExpenses.foodAndHousekeeping && monthlyExpenses.foodAndHousekeeping.populated) {
      expenses.push({
        type: ExpenseType.FOOD_HOUSEKEEPING,
        frequency: monthlyExpenses.foodAndHousekeeping.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.foodAndHousekeeping.amount
      })
    }

    if (monthlyExpenses.tvAndBroadband && monthlyExpenses.tvAndBroadband.populated) {
      expenses.push({
        type: ExpenseType.TV_AND_BROADBAND,
        frequency: monthlyExpenses.tvAndBroadband.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.tvAndBroadband.amount
      })
    }

    if (monthlyExpenses.hirePurchase && monthlyExpenses.hirePurchase.populated) {
      expenses.push({
        type: ExpenseType.HIRE_PURCHASES,
        frequency: monthlyExpenses.hirePurchase.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.hirePurchase.amount
      })
    }

    if (monthlyExpenses.mobilePhone && monthlyExpenses.mobilePhone.populated) {
      expenses.push({
        type: ExpenseType.MOBILE_PHONE,
        frequency: monthlyExpenses.mobilePhone.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.mobilePhone.amount
      })
    }

    if (monthlyExpenses.maintenance && monthlyExpenses.maintenance.populated) {
      expenses.push({
        type: ExpenseType.MAINTENANCE_PAYMENTS,
        frequency: monthlyExpenses.maintenance.schedule.value as PaymentFrequency,
        amount: monthlyExpenses.maintenance.amount
      })
    }

    if (monthlyExpenses.other && monthlyExpenses.anyOtherPopulated) {
      monthlyExpenses.other.map(source => {
        expenses.push({
          type: ExpenseType.OTHER,
          frequency: source.schedule.value as PaymentFrequency,
          amount: source.amount,
          otherName: source.name
        })
      })
    }

    return expenses
  }

  private static convertDirectionsQuestionnaire (directionsQuestionnaireDraft: DirectionsQuestionnaireDraft): DirectionsQuestionnaire {
    return DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraft)
  }
}
