import { expect } from 'chai'

import { ResponseModelConverter } from 'claims/responseModelConverter'
import { ResponseDraft } from 'response/draft/responseDraft'
import { PartyType } from 'forms/models/partyType'
import { ResponseData } from 'response/draft/responseData'
import { MobilePhone } from 'forms/models/mobilePhone'
import DateOfBirth from 'forms/models/dateOfBirth'
import { Name } from 'forms/models/name'
import { LocalDate } from 'app/forms/models/localDate'

describe('ResponseModelConverter', () => {
  let responseDraft: any
  let responseData: any

  beforeEach(() => {
    responseDraft = {
      defendantDetails: {
        name: {
          name: 'John Doe'
        } as Name,
        mobilePhone: new MobilePhone('0700000000'),
        dateOfBirth: new DateOfBirth(true, new LocalDate()),
        partyDetails: {
          name: 'John Smith',
          address: {
            line1: 'Flat 1',
            line2: 'Street 1',
            city: 'London',
            postcode: 'E10AA'
          },
          hasCorrespondenceAddress: true,
          correspondenceAddress: {
            line1: 'Flat 2',
            line2: 'Street 2',
            city: 'Belfast',
            postcode: 'B10A'
          }
        },
        email: {
          address: 'user@example.com'
        }
      },
      moreTimeNeeded: {
        option: 'no'
      },
      response: {
        type: {
          value: 'OWE_NONE'
        }
      },
      defence: {
        text: 'My defence'
      },
      freeMediation: {
        option: 'no'
      }
    }
    responseData = {
      defendant: {
        name: 'John Smith',
        address: {
          line1: 'Flat 1',
          line2: 'Street 1',
          city: 'London',
          postcode: 'E10AA'
        },
        correspondenceAddress: {
          line1: 'Flat 2',
          line2: 'Street 2',
          city: 'Belfast',
          postcode: 'B10A'
        },
        mobilePhone: '0700000000',
        email: 'user@example.com'
      },
      moreTimeNeeded: 'no',
      response: 'OWE_NONE',
      defence: 'My defence',
      freeMediation: 'no'
    }
  })

  it('should convert response submitted by individual', () => {
    responseDraft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value
    responseDraft.defendantDetails.partyDetails.dateOfBirth = {
      known: 'true',
      date: {
        year: '1999',
        month: '1',
        day: '1'
      }
    }

    responseData.defendant.type = PartyType.INDIVIDUAL.value
    responseData.defendant.dateOfBirth = '1999-01-01'

    const result = ResponseModelConverter.convert(new ResponseDraft().deserialize(responseDraft))
    expect(result).to.deep.equal(new ResponseData().deserialize(responseData))
  })

  it('should convert response submitted by sole trader', () => {
    responseDraft.defendantDetails.partyDetails.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    responseDraft.defendantDetails.partyDetails.businessName = 'Example Inc.'

    responseData.defendant.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    responseData.defendant.businessName = 'Example Inc.'

    const result = ResponseModelConverter.convert(new ResponseDraft().deserialize(responseDraft))
    expect(result).to.deep.equal(new ResponseData().deserialize(responseData))
  })

  it('should convert response submitted by company', () => {
    responseDraft.defendantDetails.partyDetails.type = PartyType.COMPANY.value
    responseDraft.defendantDetails.partyDetails.contactPerson = 'John Smith'

    responseData.defendant.type = PartyType.COMPANY.value
    responseData.defendant.contactPerson = 'John Smith'

    const result = ResponseModelConverter.convert(new ResponseDraft().deserialize(responseDraft))
    expect(result).to.deep.equal(new ResponseData().deserialize(responseData))
  })

  it('should convert response submitted by organisation', () => {
    responseDraft.defendantDetails.partyDetails.type = PartyType.ORGANISATION.value
    responseDraft.defendantDetails.partyDetails.contactPerson = 'John Smith'

    responseData.defendant.type = PartyType.ORGANISATION.value
    responseData.defendant.contactPerson = 'John Smith'

    const result = ResponseModelConverter.convert(new ResponseDraft().deserialize(responseDraft))
    expect(result).to.deep.equal(new ResponseData().deserialize(responseData))
  })

})
