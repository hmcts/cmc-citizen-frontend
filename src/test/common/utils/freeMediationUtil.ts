/* tslint:disable:no-unused-expression */
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
import * as sinon from 'sinon'

describe('FreeMediationUtil', () => {
  let isEnhancedMediationJourneyEnabledStub: sinon.SinonStub

  context('convertFreeMediation should return expected FreeMediation when', () => {

    beforeEach(() => {
      isEnhancedMediationJourneyEnabledStub = sinon.stub(FeatureToggles.prototype, 'isEnhancedMediationJourneyEnabled')
    })

    afterEach(() => {
      isEnhancedMediationJourneyEnabledStub.restore()
    })

    it('getFreeMediation value is provided', async () => {
      isEnhancedMediationJourneyEnabledStub.returns(false)
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
      expect(await FreeMediationUtil.getFreeMediation(draft)).to.deep.equal(expectedValue, 'Yes is expected')
    })

    it('getFreeMediation value is provided for enhanced mediation journey', async () => {
      isEnhancedMediationJourneyEnabledStub.returns(true)
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
      expect(await FreeMediationUtil.getFreeMediation(draft)).to.deep.equal(expectedValue, 'Yes is expected')
    })

    if (FeatureToggles.isEnabled('mediation')) {
      it('value is not provided', async () => {
        isEnhancedMediationJourneyEnabledStub.returns(false)
        const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
        const draft: MediationDraft = new MediationDraft().deserialize({
          externalId: myExternalId,
          willYouTryMediation: undefined,
          youCanOnlyUseMediation: undefined
        })
        const expectedValue: YesNoOption = YesNoOption.NO
        expect(await FreeMediationUtil.getFreeMediation(draft)).to.deep.equal(expectedValue, 'No is expected')
      })
    }
  })

  context('getMediationPhoneNumber should return expected value when', () => {

    it('company and they say yes to can we use', () => {
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
      expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue)
    })

    it('company and they say no to can we use', () => {
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
      expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue)
    })

    it('individual and they say no to can we use', () => {
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
      expect(FreeMediationUtil.getMediationPhoneNumber(claim, draft)).to.deep.equal(expectedValue)
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
  })

  context('getNoMediationReason should return expected value when', () => {

    beforeEach(() => {
      isEnhancedMediationJourneyEnabledStub = sinon.stub(FeatureToggles.prototype, 'isEnhancedMediationJourneyEnabled')
    })

    afterEach(() => {
      isEnhancedMediationJourneyEnabledStub.restore()
    })

    it('User selects a valid no mediation reason', async () => {
      isEnhancedMediationJourneyEnabledStub.returns(true)
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
          option: FreeMediationOption.NO
        },
        noMediationReason: {
          iDoNotWantMediationReason: 'ALREADY_TRIED',
          otherReason: undefined
        }
      })
      const expectedValue: string = 'ALREADY_TRIED'
      expect(await FreeMediationUtil.getNoMediationReason(draft)).to.deep.equal(expectedValue)
    })

    it('User selects other as no mediation reason', async () => {
      isEnhancedMediationJourneyEnabledStub.returns(true)
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
          option: FreeMediationOption.NO
        },
        noMediationReason: {
          iDoNotWantMediationReason: 'OTHER',
          otherReason: 'Not interested'
        }
      })
      const expectedValue: string = 'Another reason - Not interested'
      expect(await FreeMediationUtil.getNoMediationReason(draft)).to.deep.equal(expectedValue)
    })

    it('no mediation reason should be returned when the toggle is off', async () => {
      isEnhancedMediationJourneyEnabledStub.returns(false)
      const myExternalId: String = 'b17af4d2-273f-4999-9895-bce382fa24c8'
      const draft: MediationDraft = new MediationDraft().deserialize({
        externalId: myExternalId,
        willYouTryMediation: {
          option: FreeMediationOption.NO
        },
        noMediationReason: {
          iDoNotWantMediationReason: 'OTHER',
          otherReason: 'Not interested'
        }
      })
      expect(await FreeMediationUtil.getNoMediationReason(draft)).to.be.undefined
    })
  })
})
