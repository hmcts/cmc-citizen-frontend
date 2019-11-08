import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import * as uuid from 'uuid'

export const DEFAULT_PASSWORD = 'Password12'

export const SMOKE_TEST_CITIZEN_USERNAME = process.env.SMOKE_TEST_CITIZEN_USERNAME
export const SMOKE_TEST_USER_PASSWORD = process.env.SMOKE_TEST_USER_PASSWORD

export const claimFee = 25.00
export const fixedInterestAmount = 100
export const dailyInterestAmount = 5

export const claimAmount: Amount = {
  type: 'breakdown',
  rows: [
    { reason: 'Reason', amount: 10.00 },
    { reason: 'Reason', amount: 20.50 },
    { reason: 'Reason', amount: 50.00 }
  ],
  getClaimTotal (): number {
    return this.rows[0].amount + this.rows[1].amount + this.rows[2].amount
  },
  getTotal (): number {
    return this.getClaimTotal() + claimFee
  }
}

export const postcodeLookupQuery: PostcodeLookupQuery = {
  postcode: 'SW2 1AN',
  address: '10, DALBERG ROAD, LONDON, SW2 1AN'
}

export const claimReason = 'My reasons for the claim are that I am owed this money for a variety of reason, these being...'

export function createClaimData (claimantType: PartyType, defendantType: PartyType, hasEmailAddress: boolean = true,
                                 interestType: InterestType = InterestType.STANDARD): ClaimData {
  let claimData = {
    claimants: [createClaimant(claimantType)],
    defendants: [createDefendant(defendantType, hasEmailAddress)],
    payment: {
      amount: claimFee * 100,
      reference: 'RC-1524-6488-1670-7520',
      status: 'success'
    },
    feeAmountInPennies: claimFee * 100,
    amount: claimAmount,
    interest: {
      type: 'no interest'
    },
    reason: claimReason,
    timeline: { rows: [{ date: 'may', description: 'ok' }] },
    externalId: uuid(),
    get total (): number {
      switch (interestType) {
        case InterestType.STANDARD:
          return this.amount.getClaimTotal() + claimFee
        case InterestType.BREAKDOWN:
          return this.amount.getClaimTotal() + fixedInterestAmount + claimFee
      }
    },
    moneyReceivedOn: null
  } as ClaimData

  switch (interestType) {
    case InterestType.BREAKDOWN:
      claimData.interest = {
        type: 'breakdown',
        interestBreakdown: {
          totalAmount: fixedInterestAmount,
          explanation: 'up to today'
        },
        specificDailyAmount: dailyInterestAmount
      }
      claimData.interest.interestDate = {
        endDateType: 'settled_or_judgment'
      }
      break
    case InterestType.STANDARD:
      claimData.interest = {
        type: 'standard',
        rate: 8
      }
      claimData.interest.interestDate = {
        type: 'submission'
      }
      break
  }

  return claimData
}

export function createClaimant (type: PartyType): Party {
  const claimant: Party = {
    type: type,
    name: undefined,
    address: {
      line1: '10, DALBERG ROAD',
      city: 'LONDON',
      postcode: 'SW2 1AN'
    },
    correspondenceAddress: {
      line1: '234 Acacia Road',
      line2: 'a really cool place',
      city: 'Edinburgh',
      postcode: 'G72 7ZY'
    },
    phone: '07700000001'
  }

  switch (type) {
    case PartyType.INDIVIDUAL:
      claimant.name = 'John Smith'
      claimant.dateOfBirth = '1982-07-26'
      break
    case PartyType.SOLE_TRADER:
      claimant.name = 'Mr. Sole trader'
      break
    case PartyType.COMPANY:
      claimant.name = 'Claimant company Inc'
      claimant.contactPerson = 'John Smith'
      break
    case PartyType.ORGANISATION:
      claimant.name = 'United Nations'
      claimant.contactPerson = 'John Smith'
      break
  }

  return claimant
}

export function createDefendant (type: PartyType, hasEmailAddress: boolean = false): Party {
  const defendant: Party = {
    type: type,
    name: undefined,
    address: {
      line1: '11 Dalberg road',
      line2: '',
      city: 'London',
      postcode: 'SW2 1AN'
    },
    phone: '07700000002',
    email: hasEmailAddress ? 'civilmoneyclaims+automatedtest-defendant@gmail.com' : undefined
  }

  switch (type) {
    case PartyType.INDIVIDUAL:
      defendant.name = 'Mrs. Rose Smith'
      defendant.title = 'Mrs.'
      defendant.firstName = 'Rose'
      defendant.lastName = 'Smith'
      defendant.dateOfBirth = '1982-07-26'
      break
    case PartyType.SOLE_TRADER:
      defendant.name = 'Sole fish trader'
      defendant.firstName = 'Sole fish'
      defendant.lastName = 'trader'
      break
    case PartyType.COMPANY:
      defendant.name = 'Defendant company Inc'
      defendant.contactPerson = 'Rose Smith'
      break
    case PartyType.ORGANISATION:
      defendant.name = 'OrgBritish Red Cross'
      defendant.contactPerson = 'Rose Smith'
      break
  }

  return defendant
}

export function createResponseData (defendantType: PartyType): ResponseData {
  return {
    responseType: 'FULL_DEFENCE',
    defenceType: 'DISPUTE',
    defendant: createDefendant(defendantType, false),
    moreTimeNeeded: 'no',
    freeMediation: 'no',
    defence: 'I fully dispute this claim'
  }
}

export const defence: PartialDefence = {
  paidWhatIBelieveIOwe: {
    howMuchAlreadyPaid: 30.00,
    paidDate: '2016-01-01',
    explanation: 'I dont claimant full amount because'
  },
  claimAmountIsTooMuch: {
    howMuchIBelieveIOwe: 30.00,
    explanation: 'I owe this amount and not full amount because I...'
  },
  timeline: {
    events: [
      {
        date: 'Early Spring',
        description: 'Claimant accuses me of owing...'
      },
      {
        date: 'Mid Spring',
        description: 'I asked the claimant for a reason and evidence why they are doing this.'
      }
    ]
  },
  impactOfDispute: 'This dispute has affected me badly'
}

export const offer: Offer = {
  offerText: 'My Offer is that I can only afford, x, y, z and so will only pay £X amount',
  completionDate: '2020-01-01'
}
