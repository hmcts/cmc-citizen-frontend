import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { InterestDateType } from 'common/interestDateType'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { MomentFactory } from 'shared/momentFactory'

export const sampleIndividualClaimant = {
  claimants: [{
    type: 'individual',
    name: 'John Smith',
    address: {
      line1: 'line1',
      line2: 'line2',
      city: 'city',
      postcode: 'bb127nq'
    },
    dateOfBirth: '1990-02-17'
  }]
}

export const sampleIndividualDefendant = {
  defendants: [
    {
      type: 'individual',
      name: 'John Doe',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    }
  ]
}

export const sampleClaimIndividualVsIndividualIssueObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: false,
  claim: {
    ...sampleIndividualClaimant,
    ...sampleIndividualDefendant,
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Interest Reason',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: MomentFactory.currentDate().add(19, 'days'),
  features: ['admissions']
}

export const sampleClaimIndividualVsIndividualRequestingMoreTimeObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: true,
  claim: {
    ...sampleIndividualClaimant,
    ...sampleIndividualDefendant,
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Interest Reason',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: MomentFactory.currentDate().add(19, 'days'),
  features: ['admissions']
}

export const sampleClaimIndividualVsIndividualFullAdmissionPayImmediatelyObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: true,
  claim: {
    ...sampleIndividualClaimant,
    ...sampleIndividualDefendant,
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Interest Reason',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: MomentFactory.currentDate().add(19, 'days'),
  response: {
    responseType: 'FULL_ADMISSION',
    freeMediation: 'no',
    paymentIntention: {
      paymentDate: '2019-02-11',
      paymentOption: 'IMMEDIATELY'
    },
    features: ['admissions']
  }
}

export const sampleClaimIndividualVsIndividualFullAdmissionPayBySetDateObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: true,
  claim: {
    ...sampleIndividualClaimant,
    ...sampleIndividualDefendant,
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Interest Reason',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: MomentFactory.currentDate().add(19, 'days'),
  response: {
    responseType: 'FULL_ADMISSION',
    freeMediation: 'no',
    paymentIntention: {
      paymentDate: '2888-12-20',
      paymentOption: 'BY_SPECIFIED_DATE'
    },
    statementOfMeans: {
      carer: false,
      reason: 'I cannot afford this right now with my current income.',
      residence: {
        type: 'OWN_HOME'
      },
      disability: 'NO',
      employment: {
        unemployment: {
          retired: false,
          unemployed: {
            numberOfYears: 1,
            numberOfMonths: 2
          }
        }
      },
      bankAccounts: [
        {
          type: 'CURRENT_ACCOUNT',
          joint: true,
          balance: 100
        }
      ]
    }
  },
  features: ['admissions']
}

export const sampleClaimIndividualVsIndividualFullAdmissionRepaymentPlanObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: true,
  claim: {
    ...sampleIndividualClaimant,
    ...sampleIndividualDefendant,
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Interest Reason',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: MomentFactory.currentDate().add(19, 'days'),
  response: {
    responseType: 'FULL_ADMISSION',
    freeMediation: 'no',
    paymentIntention: {
      paymentOption: 'INSTALMENTS',
      repaymentPlan: {
        paymentLength: '10 months',
        completionDate: '3000-03-20',
        paymentSchedule: 'EVERY_MONTH',
        firstPaymentDate: '2999-06-20',
        instalmentAmount: 10
      },
      statementOfMeans: {
        carer: false,
        reason: 'I cannot afford this right now with my current income.',
        residence: {
          type: 'OWN_HOME'
        },
        disability: 'NO',
        employment: {
          unemployment: {
            retired: false,
            unemployed: {
              numberOfYears: 1,
              numberOfMonths: 2
            }
          }
        },
        bankAccounts: [
          {
            type: 'CURRENT_ACCOUNT',
            joint: true,
            balance: 100
          }
        ]
      }
    },
    features: ['admissions']
  }
}
