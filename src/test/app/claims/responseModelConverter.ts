import { expect } from 'chai'

import { ResponseModelConverter } from 'app/claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import { responseDraft as draftTemplate } from '../../data/draft/responseDraft'
import { responseDraft as partAdmissionDraft } from '../../data/draft/response/partAdmission'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from '../../data/draft/partyDetails'

import { Response } from 'claims/models/response'
import { responseData as entityTemplate } from '../../data/entity/responseData'
import { responseData as partAdmissionResponse } from '../../data/entity/response/partAdmission'
import { company, individual, organisation, soleTrader } from '../../data/entity/party'

function prepareResponseDraft (partyDetails: object) {
  return new ResponseDraft().deserialize({
    ...draftTemplate,
    defendantDetails: { ...draftTemplate.defendantDetails, partyDetails: partyDetails }
  })
}

function prepareResponseData (party: object) {
  return Response.deserialize({
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

      expect(ResponseModelConverter.fromDraft(responseDraft)).to.deep.equal(responseData)
    })
  })

  it('converts part admission response', () => {
    const draft = new ResponseDraft().deserialize(partAdmissionDraft)
    const response = Response.deserialize(partAdmissionResponse)

    expect(ResponseModelConverter.fromDraft(draft)).to.deep.equal(response)
  })
})
