import { expect } from 'chai'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { defenceWithDisputeDraft } from 'test/data/draft/responseDraft'
import { FeatureToggles } from 'utils/featureToggles'

describe('FreeMediationUtil', () => {

  context('Should return expected Free Mediation when', () => {

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

    if (FeatureToggles.isEnabled('mediation')) {
      it('getMediationPhoneNumber when company and they say yes to can we use', () => {
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
        expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.be.deep.eq(expectedValue)
      })

      it('getMediationPhoneNumber when company and they say no to can we use', () => {
        const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
        const draft: MediationDraft = new MediationDraft().deserialize({
          externalId: myExternalId,
          youCanOnlyUseMediation: {
            option: FreeMediationOption.YES
          },
          canWeUseCompany: {
            option: FreeMediationOption.NO,
            mediationPhoneNumber: '07777777788',
            mediationContactPerson: 'Mary Richards'
          },
          willYouTryMediation: {
            option: FreeMediationOption.YES
          }
        })
        const expectedValue: string = '07777777788'
        const claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj)
        expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.be.deep.eq(expectedValue)
      })

      it('getMediationPhoneNumber when individual and they say no to can we use', () => {
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
        expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.be.deep.eq(expectedValue)
      })

      it('getMediationPhoneNumber when individual and they say yes to can we use', () => {
        const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(defenceWithDisputeDraft)
        const draft: MediationDraft = new MediationDraft().deserialize({
          externalId: myExternalId,
          youCanOnlyUseMediation: {
            option: FreeMediationOption.YES
          },
          canWeUse: {
            option: FreeMediationOption.YES
          },
          willYouTryMediation: {
            option: FreeMediationOption.YES
          }
        })
        const expectedValue: string = '0700000000'
        const claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimIssueObj)
        expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft, responseDraft)).to.be.deep.eq(expectedValue)
      })
    }
  })
})
