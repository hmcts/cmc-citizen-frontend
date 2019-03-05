import { PartyType } from 'common/partyType'

export const individual = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
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
  name: 'Rosa Smith',
  businessName: 'Example Inc.',
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
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 3',
    line2: 'Street 3',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E3 8FA'
  },
  correspondenceAddress: {
    line1: 'Flat 30',
    line2: 'Street 30',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT3 5GB'
  },
  mobilePhone: '0700000003',
  email: 'company@example.com'
}

export const organisation = {
  type: PartyType.ORGANISATION.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 4',
    line2: 'Street 4',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E4 8FA'
  },
  correspondenceAddress: {
    line1: 'Flat 40',
    line2: 'Street 40',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT4 5GB'
  },
  mobilePhone: '0700000004',
  email: 'organisation@example.com'
}
