import { PartyType } from 'forms/models/partyType'

export const individual = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  },
  dateOfBirth: '1999-01-01',
  mobilePhone: '0700000000',
  email: 'user@example.com'
}

export const soleTrader = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'John Smith',
  businessName: 'Example Inc.',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  },
  mobilePhone: '0700000000',
  email: 'user@example.com'
}

export const company = {
  type: PartyType.COMPANY.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  },
  mobilePhone: '0700000000',
  email: 'user@example.com'
}

export const organisation = {
  type: PartyType.ORGANISATION.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  },
  mobilePhone: '0700000000',
  email: 'user@example.com'
}
