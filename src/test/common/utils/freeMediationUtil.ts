import { MediationDraft } from 'main/features/mediation/draft/mediationDraft'
import { FreeMediationUtil } from 'main/common/utils/freeMediationUtil'
import { expect } from 'chai'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import { FreeMediationOption } from 'forms/models/freeMediation'

context('FreeMediationUtil', () => {

  const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

  describe('convert free mediation', () => {
    it('should convert free mediation option from mediation draft when youCanOnlyUseMediation as YES', () => {
      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        }})

      expect(FreeMediationUtil.getFreeMediation(mediationDraft)).to.be.eq(FreeMediationOption.YES)
    })

    it('should convert free mediation option from mediation draft when youCanOnlyUseMediation as undefined', () => {
      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: undefined})

      expect(FreeMediationUtil.getFreeMediation(mediationDraft)).to.be.eq(FreeMediationOption.NO)
    })

    it('should convert free mediation option from mediation draft when youCanOnlyUseMediation as NO', () => {
      const mediationDraft = new MediationDraft().deserialize({
        youCanOnlyUseMediation: {
          option: FreeMediationOption.NO
        }})

      expect(FreeMediationUtil.getFreeMediation(mediationDraft)).to.be.eq(FreeMediationOption.NO)
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

      expect(FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft)).to.be.eq('07777777788')
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

      expect(FreeMediationUtil.getMediationContactPerson(claim, mediationDraft, undefined))
        .to.be.eq('Mary Richards')
    })
  })
})
