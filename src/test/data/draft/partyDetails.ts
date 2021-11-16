import { PartyType } from 'common/partyType'

export const addressCorrespondenceAddress = {
  address: {
    line1: 'Flat 2',
    line2: 'Street 2',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E2 8FA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 20',
    line2: 'Street 20',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT2 5GB'
  }
}

export const individualDetails = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  firstName: 'John',
  lastName: 'Smith',
  ...addressCorrespondenceAddress,
  dateOfBirth: {
    known: true,
    date: {
      year: 1999,
      month: 1,
      day: 1
    }
  }
}

export const individualSplitNameDetails = {
  ...individualDetails,
  name: 'Mr. John Smith',
  title: 'Mr.',
  firstName: 'John',
  lastName: 'Smith'
}

export const defendantIndividualDetails = {
  ...individualDetails,
  title: 'Mr.',
  firstName: 'John',
  lastName: 'Smith'
}

export const soleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,

  firstName: 'John',
  lastName: 'Smith',
  businessName: 'SoleTrader Ltd.',
  ...addressCorrespondenceAddress
}

export const claimantSoleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  firstName: 'Claimant',
  lastName: 'SoleTrader',
  businessName: 'Claimant SoleTrader Ltd.',
  ...addressCorrespondenceAddress
}

export const defendantSoleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'Defendant SoleTrader',
  title: undefined,
  firstName: 'Defendant',
  lastName: 'SoleTrader',
  businessName: 'Defendant SoleTrader Ltd.',
  ...addressCorrespondenceAddress
}

export const companyDetails = {
  type: PartyType.COMPANY.value,
  name: 'Company Ltd.',
  contactPerson: 'Company Smith',
  ...addressCorrespondenceAddress
}

export const organisationDetails = {
  type: PartyType.ORGANISATION.value,
  name: 'Organisation.',
  contactPerson: 'Organisation Smith',
  ...addressCorrespondenceAddress
}

export function partyDetails (partyType: string) {
  switch (partyType) {
    case PartyType.INDIVIDUAL.value:
      return individualDetails
    case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
      return soleTraderDetails
    case PartyType.COMPANY.value:
      return companyDetails
    case PartyType.ORGANISATION.value:
      return organisationDetails
    default:
      throw new Error(`Unknown party type: ${partyType}`)
  }
}
