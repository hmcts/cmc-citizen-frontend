import { expect } from 'chai'

import { ResponseModelConverter } from 'app/claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import { responseDraft as draftTemplate } from '../../data/draft/responseDraft'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from '../../data/draft/partyDetails'

import { DefendantResponse } from 'claims/models/defendantResponse'
import { responseData as entityTemplate } from '../../data/entity/responseData'
import { company, individual, organisation, soleTrader } from '../../data/entity/party'

function prepareResponseDraft (partyDetails: object) {
  return new ResponseDraft().deserialize({
    ...draftTemplate,
    defendantDetails: { ...draftTemplate.defendantDetails, partyDetails: partyDetails }
  })
}

function prepareResponseData (party: object) {
  return new DefendantResponse().deserialize({
    ...entityTemplate,
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
    it(`should convert response submitted by ${partyDetails.type}`, () => {
      const responseDraft = prepareResponseDraft(partyDetails)
      const responseData = prepareResponseData(party)

      expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
    })
  })
})
