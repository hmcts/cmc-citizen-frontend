import { PartyType } from 'common/partyType'

export const individualDetails = {
  type: PartyType.INDIVIDUAL.value,
  name: 'John Smith',
  address: {
    line1: 'Flat 1',
    line2: 'Street 1',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E1 8FA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 10',
    line2: 'Street 10',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT1 5GB'
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
  name: 'SoleTrader Smith',
  businessName: 'SoleTrader Ltd.',
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

export const claimantSoleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'Claimant SoleTrader',
  businessName: 'Claimant SoleTrader Ltd.',
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

export const defendantSoleTraderDetails = {
  type: PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
  name: 'Defendant SoleTrader',
  businessName: 'Defendant SoleTrader Ltd.',
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

export const companyDetails = {
  type: PartyType.COMPANY.value,
  name: 'Company Ltd.',
  contactPerson: 'Company Smith',
  address: {
    line1: 'Flat 3',
    line2: 'Street 3',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E3 8FA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 30',
    line2: 'Street 30',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT3 5GB'
  }
}

export const organisationDetails = {
  type: PartyType.ORGANISATION.value,
  name: 'Organisation.',
  contactPerson: 'Organisation Smith',
  address: {
    line1: 'Flat 4',
    line2: 'Street 4',
    line3: 'Cool house name',
    city: 'London',
    postcode: 'E4 8FA'
  },
  hasCorrespondenceAddress: true,
  correspondenceAddress: {
    line1: 'Flat 40',
    line2: 'Street 40',
    line3: 'Cooler house name',
    city: 'Belfast',
    postcode: 'BT4 5GB'
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
