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

export const individual = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  ...addressCorrespondenceAddress,
  dateOfBirth: '1999-01-01',
  mobilePhone: '0700000001',
  email: 'individual@example.com'
}

export const individualDefendant = {
  type: PartyType.INDIVIDUAL.value,
  name: 'Mr. John Smith',
  title: 'Mr.',
  firstName: 'John',
  lastName: 'Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E1 8FA'
  },
  correspondenceAddress: {
    line1: 'Flat 10',
    line2: 'Street 10',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT1 5GB'
  },
  dateOfBirth: '1999-01-01',
  mobilePhone: '0700000001',
  email: 'individual@example.com'
}

export const soleTrader = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'SoleTrader Smith',
  businessName: 'SoleTrader Ltd.',
  ...addressCorrespondenceAddress,
  mobilePhone: '0700000002',
  email: 'sole-trader@example.com'
}

export const soleTraderDefendant = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'Mr. SoleTrader Smith',
  title: 'Mr.',
  firstName: 'SoleTrader',
  lastName: 'Smith',
  businessName: 'SoleTrader Ltd.',
  address: {
    line1: 'Flat 2',
    line2: 'Street 2',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E2 8FA'
  },
  correspondenceAddress: {
    line1: 'Flat 20',
    line2: 'Street 20',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT2 5GB'
  },
  mobilePhone: '0700000002',
  email: 'sole-trader@example.com'
}

export const company = {
  type: PartyType.COMPANY.value,
  name: 'Company Ltd.',
  contactPerson: 'Company Smith',
  ...addressCorrespondenceAddress,
  mobilePhone: '0700000003',
  email: 'company@example.com'
}

export const organisation = {
  type: PartyType.ORGANISATION.value,
  name: 'Organisation.',
  contactPerson: 'Organisation Smith',
  ...addressCorrespondenceAddress,
  mobilePhone: '0700000004',
  email: 'organisation@example.com'
}
