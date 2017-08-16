import { expect } from 'chai'

import { ResponseModelConverter } from 'claims/responseModelConverter'
import { ResponseDraft } from 'response/draft/responseDraft'
import { MobilePhone } from 'forms/models/mobilePhone'
import DateOfBirth from 'forms/models/dateOfBirth'
import { Response as DefendantResponse } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import Defence from 'response/form/models/defence'
import { FreeMediation, FreeMediationOption } from 'response/form/models/freeMediation'
import { PartyDetails } from 'forms/models/partyDetails'
import { Address } from 'forms/models/address'
import { Defendant } from 'drafts/models/defendant'
import { Name } from 'forms/models/name'

const testAddress = {
  line1: 'line1',
  postcode: 'postcode'
} as Address

describe('ResponseModelConverter', () => {
  let responseDraft

  beforeEach(() => {
    responseDraft = {
      defendantDetails: {
        name: {
          name: 'John Doe'
        } as Name,
        mobilePhone: new MobilePhone('whatever'),
        dateOfBirth: new DateOfBirth(),
        partyDetails: {
          address: testAddress,
          hasCorrespondenceAddress: true,
          correspondenceAddress: testAddress
        } as PartyDetails
      } as Defendant,
      response: new DefendantResponse(ResponseType.OWE_NONE),
      defence: new Defence('my defence'),
      freeMediation: new FreeMediation(FreeMediationOption.NO),
      requireDefence: () => true
    } as ResponseDraft
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

    it('should flatten the name property to a string', () => {
      let converted = ResponseModelConverter.convert(responseDraft)
      expect(converted.defendantDetails.name).to.equal('John Doe')
    })
  })
})
