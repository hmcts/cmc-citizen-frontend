import { PartyType } from 'forms/models/partyType'

export const individualDetails = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  },
  dateOfBirth: {
    known: true,
    date: {
      year: 1999,
      month: 1,
      day: 1
    }
  }
}

export const soleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'John Smith',
  businessName: 'Example Inc.',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  }
}

export const companyDetails = {
  type: PartyType.COMPANY.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  }
}

export const organisationDetails = {
  type: PartyType.ORGANISATION.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    city: 'London',
    postcode: 'E10AA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 2',
    line2: 'Street 2',
    city: 'Belfast',
    postcode: 'B10A'
  }
}
