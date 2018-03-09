import { expect } from 'chai'

import { ResponseModelConverter } from 'app/claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import { defenceWithDisputeDraft, defenceWithAmountClaimedAlreadyPaidDraft } from '../../data/draft/responseDraft'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from '../../data/draft/partyDetails'

import { Response } from 'claims/models/response'
import { defenceWithDisputeData, defenceWithAmountClaimedAlreadyPaidData } from '../../data/entity/responseData'
import { company, individual, organisation, soleTrader } from '../../data/entity/party'

function prepareResponseDraft (draftTemplate: any, partyDetails: object) {
  return new ResponseDraft().deserialize({
    ...draftTemplate,
    defendantDetails: { ...draftTemplate.defendantDetails, partyDetails: partyDetails }
  })
}

function prepareResponseData (template, party: object) {
  return Response.deserialize({
    ...template,
    defendant: { ...party, email: 'user@example.com', mobilePhone: '0700000000' }
  })
}

describe('ResponseModelConverter', () => {
  [
    [individualDetails, individual],
    [soleTraderDetails, soleTrader],
    [companyDetails, company],
    [organisationDetails, organisation]
  ].forEach(([partyDetails, party]) => {
    it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
      const responseDraft = prepareResponseDraft(defenceWithDisputeDraft, partyDetails)
      const responseData = prepareResponseData(defenceWithDisputeData, party)

      expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
    })

    it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type}`, () => {
      const responseDraft = prepareResponseDraft(defenceWithAmountClaimedAlreadyPaidDraft, partyDetails)
      const responseData = prepareResponseData(defenceWithAmountClaimedAlreadyPaidData, party)

      expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
    })
  })

  it('should not convert payment declaration for defence with dispute', () => {
    const responseDraft = prepareResponseDraft({
      ...defenceWithDisputeDraft,
      whenDidYouPay: {
        date: {
          year: 2017,
          month: 12,
          day: 31
        },
        text: 'I paid in cash'
      }
    }, individualDetails)
    const responseData = prepareResponseData(defenceWithDisputeData, individual)

    expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
  })
})
