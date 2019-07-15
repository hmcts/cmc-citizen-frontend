import { expect } from 'chai'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { Claim } from 'claims/models/claim'

describe('FreeMediationUtil', () => {

  context('Should return expected Free Mediation when', () => {

    it('yes value is provided', () => {
      const freeMediation: FreeMediation = new FreeMediation('yes')
      const expectedValue: YesNoOption = YesNoOption.YES
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'Yes is expected')
    })

    it('no value is provided', () => {
      const freeMediation: FreeMediation = new FreeMediation('no')
      const expectedValue: YesNoOption = YesNoOption.NO
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'No is expected')
    })

    it('undefined value is provided', () => {
      const freeMediation = undefined
      const expectedValue: YesNoOption = YesNoOption.NO
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'No is expected')
    })

    it('getFreeMediation value is provided', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        },
        willYouTryMediation: {
          option: FreeMediationOption.YES
        }
      })
      const expectedValue: YesNoOption = YesNoOption.YES
      expect(FreeMediationUtil.getFreeMediation(draft)).to.be.deep.eq(expectedValue, FreeMediationOption.YES)
    })

    it('getMediationPhoneNumber when canWeUseCompany value is provided', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        },
        canWeUseCompany: {
          option: FreeMediationOption.YES,
          mediationPhoneNumberConfirmation: '07777777788',
          mediationContactPerson: 'Mary Richards'
        },
        willYouTryMediation: {
          option: FreeMediationOption.YES
        }
      })
      const expectedValue: string = '07777777788'
      const claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj)
      expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.be.deep.eq(expectedValue, '07777777788')
    })

    it('getMediationPhoneNumber when canWeUse value is provided', () => {
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        youCanOnlyUseMediation: {
          option: FreeMediationOption.YES
        },
        canWeUse: {
          option: FreeMediationOption.NO,
          mediationPhoneNumber: '07777777799'
        },
        willYouTryMediation: {
          option: FreeMediationOption.YES
        }
      })
      const expectedValue: string = '07777777799'
      const claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj)
      expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.be.deep.eq(expectedValue, '07777777799')
    })

  })
})
