import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { FreeMediationExtractor } from 'claims/freeMediationExtractor'
import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'

context('FreeMediationExtractor', () => {

  const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

  describe('convert free mediation', () => {
    it('should convert free mediation option from mediation draft', () => {
      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        }})

      expect(FreeMediationExtractor.getFreeMediation(mediationDraft)).to.be.eq(FreeMediationOption.YES)
    })
  })

  describe('convert mediation phone number', () => {
    it('should convert mediation phone number from mediation draft', () => {

      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        },
        canWeUseCompany: {
          option: FreeMediationOption.YES,
          mediationPhoneNumberConfirmation: '07777777788'
        }})

      expect(FreeMediationExtractor.getMediationPhoneNumber(claim, mediationDraft)).to.be.eq('07777777788')
    })
  })

  describe('convert mediation contact person', () => {
    it('should convert mediation contact person from mediation draft', () => {

      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        },
        canWeUseCompany: {
          option: FreeMediationOption.NO,
          mediationContactPerson: 'Mary Richards'
        }})

      expect(FreeMediationExtractor.getMediationContactPerson(claim, mediationDraft, undefined))
        .to.be.eq('Mary Richards')
    })
  })
})
