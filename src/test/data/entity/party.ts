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
  ...individual,
  name: 'Mr. John Smith',
  title: 'Mr.',
  firstName: 'John',
  lastName: 'Smith'
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
  ...soleTrader,
  businessName: 'Defendant SoleTrader Ltd.',
  name: 'Defendant SoleTrader',
  title: undefined,
  firstName: 'Defendant',
  lastName: 'SoleTrader'
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

export const organisationWithPhone = {
  type: PartyType.ORGANISATION.value,
  name: 'Organisation.',
  contactPerson: 'Organisation Smith',
  ...addressCorrespondenceAddress,
  phone: '0700000004',
  email: 'organisation@example.com'
}
