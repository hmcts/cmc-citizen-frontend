import { expect } from 'chai'

import {
  partyDetails,
  claimantPartyDetails,
  defendantPartyDetails,
  individualDetails,
  soleTraderDetails,
  organisationDetails,
  companyDetails
}
  from 'drafts/draft-data/partyDetails'
import { PartyType } from 'common/partyType'

describe('Both Party Details', () => {

  describe('partyDetails', () => {

    it('should return individual details if I pass party type Individual ', () => {
      expect(partyDetails('individual')).to.equal(individualDetails)
    })

    it('should return soleTrader details if I pass party type soleTrader ', () => {
      expect(partyDetails('soleTrader')).to.equal(soleTraderDetails)
    })

    it('should return compay details if I pass party type Company ', () => {
      expect(partyDetails('company')).to.equal(companyDetails)
    })

    it('should return organisation details if I pass party type Organisation ', () => {
      expect(partyDetails('organisation')).to.equal(organisationDetails)
    })

  })

  describe('claimantPartyDetails', () => {

    it('should return individual details if I pass party type Individual ', () => {
      const claimantDetails = claimantPartyDetails('individual')

      expect(claimantDetails.type).to.equal(PartyType.INDIVIDUAL.value)
    })

    it('should return soldeTrader details if I pass party type SoleTrader ', () => {
      const claimantDetails = claimantPartyDetails('soleTrader')

      expect(claimantDetails.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
    })

    it('should return company details if I pass party type Company ', () => {
      const claimantDetails = claimantPartyDetails('company')

      expect(claimantDetails.type).to.equal(PartyType.COMPANY.value)
    })

    it('should return organisation details if I pass party type Organisation ', () => {
      const claimantDetails = claimantPartyDetails('organisation')

      expect(claimantDetails.type).to.equal(PartyType.ORGANISATION.value)
    })

  })

  describe('defendantPartyDetails', () => {

    it('should return individual details if I pass party type Individual ', () => {
      const claimantDetails = defendantPartyDetails('individual')

      expect(claimantDetails.type).to.equal(PartyType.INDIVIDUAL.value)
    })

    it('should return soleTrader details if I pass party type SoleTrader ', () => {
      const claimantDetails = defendantPartyDetails('soleTrader')

      expect(claimantDetails.type).to.equal(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value)
    })

    it('should return company details if I pass party type Company ', () => {
      const claimantDetails = defendantPartyDetails('company')

      expect(claimantDetails.type).to.equal(PartyType.COMPANY.value)
    })

    it('should return organisation details if I pass party type Organisation ', () => {
      const claimantDetails = defendantPartyDetails('organisation')

      expect(claimantDetails.type).to.equal(PartyType.ORGANISATION.value)
    })

  })
})
