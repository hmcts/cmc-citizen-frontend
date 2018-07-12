import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'
import { ResidenceType } from 'claims/models/response/statement-of-means/residence'
import { BankAccountType } from 'claims/models/response/statement-of-means/bankAccount'

import { MomentFactory } from 'shared/momentFactory'
import { individual } from 'test/data/entity/party'

const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no'
}

const baseDefenceData = {
  responseType: 'FULL_DEFENCE',
  defence: 'My defence',
  freeMediation: 'no'
}

export const defenceWithDisputeData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'DISPUTE'
}

export const defenceWithAmountClaimedAlreadyPaidData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'ALREADY_PAID',
  paymentDeclaration: {
    paidDate: '2017-12-31',
    explanation: 'I paid in cash'
  }
}

const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: undefined
}

export const fullAdmissionWithImmediatePaymentData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.IMMEDIATELY,
  paymentDate: MomentFactory.currentDate().add(5, 'days')
}

export const fullAdmissionWithPaymentBySetDateData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.FULL_BY_SPECIFIED_DATE,
  paymentDate: '2050-12-31'
}

export const fullAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.INSTALMENTS,
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: '2050-12-31',
    paymentSchedule: PaymentSchedule.EACH_WEEK
  }
}

export const statementOfMeansWithMandatoryFieldsOnlyData = {
  bankAccounts: [
    {
      balance: 1000,
      joint: false,
      type: BankAccountType.CURRENT_ACCOUNT
    }
  ],
  residence: {
    type: ResidenceType.OWN_HOME
  },
  employment: {
    unemployment: {
      retired: true
    }
  },
  incomes: [{
    amountReceived: 200,
    frequency: 'WEEK',
    type: 'CHILD_BENEFIT'
  }]
}

export const statementOfMeansWithAllFieldsData = {
  ...statementOfMeansWithMandatoryFieldsOnlyData,
  dependant: {
    children: [{
      ageGroupType: AgeGroupType.UNDER_11,
      numberOfChildren: 1
    }, {
      ageGroupType: AgeGroupType.BETWEEN_11_AND_15,
      numberOfChildren: 2
    }, {
      ageGroupType: AgeGroupType.BETWEEN_16_AND_19,
      numberOfChildren: 3,
      numberOfChildrenLivingWithYou: 3
    }],
    numberOfMaintainedChildren: 4
  },
  employment: {
    employers: [{
      jobTitle: 'Service manager',
      name: 'HMCTS'
    }],
    selfEmployment: {
      jobTitle: 'Director',
      annualTurnover: 10000,
      onTaxPayments: {
        amountYouOwe: 100,
        reason: 'Various taxes'
      }
    }
  },
  debts: [{
    description: 'Hard to tell',
    totalOwed: 1000,
    monthlyPayments: 100
  }],
  courtOrders: [{
    claimNumber: '000MC001',
    amountOwed: 100,
    monthlyInstalmentAmount: 10
  }]
}
