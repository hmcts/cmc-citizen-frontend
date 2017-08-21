import { expect } from 'chai'

import { ResponseModelConverter } from 'claims/responseModelConverter'
// import { ResponseDraft } from 'response/draft/responseDraft'
import Email from 'forms/models/email'
import DateOfBirth from 'forms/models/dateOfBirth'
// import { Response as DefendantResponse } from 'response/form/models/response'
// import { ResponseType } from 'response/form/models/responseType'
// import Defence from 'response/form/models/defence'
// import { FreeMediation, FreeMediationOption } from 'response/form/models/freeMediation'
import { PartyDetails } from 'forms/models/partyDetails'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'forms/models/address'
import Payment from 'app/pay/payment'

const testAddress = {
  line1: 'line1',
  postcode: 'postcode'
} as Address

describe.skip('ResponseModelConverter', () => {
  let responseDraft

  beforeEach(() => {
    responseDraft = {
      defendantDetails: {
        payment: new Payment(),
        email: new Email('whatever'),
        dateOfBirth: new DateOfBirth(),
        partyTypeResponse: new PartyTypeResponse(PartyType.INDIVIDUAL),
        partyDetails: {
          name: 'John Doe',
          address: testAddress,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress
        } as PartyDetails
      }
      // response: new DefendantResponse(ResponseType.OWE_NONE),
      // defence: new Defence('my defence'),
      // freeMediation: new FreeMediation(FreeMediationOption.NO),
      // requireDefence: () => true
    } // as ResponseDraft
  })

  context('when converting party details', () => {
    it('should delete the partyDetails property', () => {
      let converted = ResponseModelConverter.convert(responseDraft)
      expect(converted.defendantDetails.hasOwnProperty('partyDetails')).to.equal(false)
    })

    it('should flatten the address on the converted object', () => {
      let converted = ResponseModelConverter.convert(responseDraft)
      expect(converted.defendantDetails.address).to.deep.equal(testAddress)
    })

    it('should flatten the correspondence address on the converted object if one is provided', () => {
      let converted = ResponseModelConverter.convert(responseDraft)
      expect(converted.defendantDetails.correspondenceAddress).to.deep.equal(testAddress)
    })

    it('should not set correspondence address the converted object if one is not provided', () => {
      responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress = false
      let converted = ResponseModelConverter.convert(responseDraft)
      expect(converted.defendantDetails.hasOwnProperty('correspondenceAddress')).to.equal(false)
    })
  })
})
