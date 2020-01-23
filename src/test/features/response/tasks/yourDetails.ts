/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { YourDetails } from 'response/tasks/yourDetails'
import { Phone } from 'forms/models/phone'
import { PartyDetails } from 'forms/models/partyDetails'
import { Address } from 'forms/models/address'
import { IndividualDetails } from 'forms/models/individualDetails'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { generateString } from 'test/app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'SW1A 1AA')
const invalidAddress = new Address('', '', '', '', '')

describe('Your details task', () => {
  let draft: ResponseDraft
  let individualDetails: IndividualDetails
  let soleTraderDetails: SoleTraderDetails
  let companyDetails: CompanyDetails
  let organisationDetails: OrganisationDetails

  beforeEach(() => {
    draft = new ResponseDraft()
    individualDetails = new IndividualDetails()
    soleTraderDetails = new SoleTraderDetails()
    companyDetails = new CompanyDetails()
    organisationDetails = new OrganisationDetails()
  })

  context('should not be completed when', () => {
    it('response is undefined', () => {
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant details is undefined', () => {
      draft.defendantDetails = undefined
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party details is undefined', () => {
      draft.defendantDetails.partyDetails = undefined
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party address is undefined', () => {
      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = undefined
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party address is invalid', () => {
      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = invalidAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party correspondence address is invalid', () => {
      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.partyDetails.hasCorrespondenceAddress = true
      draft.defendantDetails.partyDetails.correspondenceAddress = invalidAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is undefined', () => {
      individualDetails.dateOfBirth = undefined

      draft.defendantDetails.partyDetails = individualDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual phone is undefined', () => {
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))

      draft.defendantDetails.partyDetails = individualDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is invalid', () => {
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(90, 11, 25))

      draft.defendantDetails.partyDetails = individualDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual phone is invalid', () => {
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))

      draft.defendantDetails.partyDetails = individualDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone(generateString(31))

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader phone is undefined', () => {
      draft.defendantDetails.partyDetails = soleTraderDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader phone is invalid', () => {
      draft.defendantDetails.partyDetails = soleTraderDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone(generateString(31))

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company phone is undefined', () => {
      draft.defendantDetails.partyDetails = companyDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company phone is invalid', () => {
      draft.defendantDetails.partyDetails = companyDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone(generateString(31))

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation phone is undefined', () => {
      draft.defendantDetails.partyDetails = organisationDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation phone is invalid', () => {
      draft.defendantDetails.partyDetails = organisationDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone(generateString(31))

      expect(YourDetails.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when', () => {
    it('all individual address, date of birth and phone are valid', () => {
      individualDetails.dateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))

      draft.defendantDetails.partyDetails = individualDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both sole trader address and phone are valid', () => {
      draft.defendantDetails.partyDetails = soleTraderDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both company address and phone are valid', () => {
      draft.defendantDetails.partyDetails = companyDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both organisation address and phone are valid', () => {
      draft.defendantDetails.partyDetails = organisationDetails
      draft.defendantDetails.partyDetails.address = validAddress
      draft.defendantDetails.phone = new Phone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.true
    })
  })
})
