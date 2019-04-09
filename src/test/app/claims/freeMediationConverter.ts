import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { FreeMediationConverter } from 'claims/freeMediationConverter'
import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'

context('FreeMediationConverter', () => {

  const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

  describe('convert free mediation', () => {
    it('should convert free mediation option from mediation draft', () => {
      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        }})

      expect(FreeMediationConverter.convertFreeMediation(mediationDraft)).to.be.eq(FreeMediationOption.YES)
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

      expect(FreeMediationConverter.convertMediationPhoneNumber(claim, mediationDraft)).to.be.eq('07777777788')
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

      expect(FreeMediationConverter.convertMediationContactPerson(claim, mediationDraft, undefined))
        .to.be.eq('Mary Richards')
    })
  })
})
