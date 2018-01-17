import { PartyType } from 'app/common/partyType'

export const individualDetails = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    line3: '',
    city: 'London',
    postcode: 'E1A'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 10',
    line2: 'Street 10',
    line3: '',
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
  name: 'Rosa Smith',
  businessName: 'Example Inc.',
  address: {
    line1: 'Flat 2',
    line2: 'Street 2',
    line3: '',
    city: 'London',
    postcode: 'E2A'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 20',
    line2: 'Street 20',
    line3: '',
    city: 'Belfast',
    postcode: 'B20A'
  }
}

export const companyDetails = {
  type: PartyType.COMPANY.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 3',
    line2: 'Street 3',
    line3: '',
    city: 'London',
    postcode: 'E3A'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 30',
    line2: 'Street 30',
    line3: '',
    city: 'Belfast',
    postcode: 'B30A'
  }
}

export const organisationDetails = {
  type: PartyType.ORGANISATION.value,
  name: 'Example Inc.',
  contactPerson: 'John Smith',
  address: {
    line1: 'Flat 4',
    line2: 'Street 4',
    line3: '',
    city: 'London',
    postcode: 'E4A'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 40',
    line2: 'Street 40',
    line3: '',
    city: 'Belfast',
    postcode: 'B40A'
  }
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
