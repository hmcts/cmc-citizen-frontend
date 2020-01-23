/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

describe('AmountHelper', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  describe('calculateTotalAmount', () => {
    context('response type is full admission', () => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      draft = new DraftClaimantResponse().deserialize({})

      it('should return "totalAmountTillToday"', () => {
        expect(AmountHelper.calculateTotalAmount(claim, draft)).to.equal(claim.totalAmountTillToday)
      })
    })

    context('response type is part admission', () => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj })

      it('should return "totalAmountTillToday" when the claimant did not settle', () => {
        expect(AmountHelper.calculateTotalAmount(claim, draft)).to.equal(claim.totalAmountTillToday)
      })
      it('should return settlement amount and claim fee when the claimant settled for a lower amount', () => {
        draft = new DraftClaimantResponse().deserialize(
          {
            settleAdmitted: {
              admitted: {
                option: 'yes'
              }
            }
          }
        )

        expect(AmountHelper.calculateTotalAmount(claim, draft)).to.equal((claim.response as PartialAdmissionResponse).amount + claim.claimData.feeAmountInPennies / 100)
      })
    })
  })

  describe('calculateAmountSettledFor', () => {
    context('response type is full admission', () => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })

      it('should return undefined', () => {
        draft = new DraftClaimantResponse().deserialize({})
        expect(AmountHelper.calculateAmountSettledFor(claim, draft)).to.be.undefined
      })
    })

    context('response type is part admission', () => {
      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj })

      it('should return undefined when the claimant did not settle', () => {
        draft = new DraftClaimantResponse().deserialize({})
        expect(AmountHelper.calculateAmountSettledFor(claim, draft)).to.be.undefined
      })
      it('should return settlement amount when the claimant settled for a lower amount', () => {
        draft = new DraftClaimantResponse().deserialize(
          {
            settleAdmitted: {
              admitted: {
                option: 'yes'
              }
            }
          }
        )
        expect(AmountHelper.calculateAmountSettledFor(claim, draft))
          .to.equal((claim.response as PartialAdmissionResponse).amount)
      })
    })
  })
})
