/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ResponseDraft } from 'response/draft/responseDraft'
import { YourDetails } from 'response/tasks/yourDetails'
import { Email } from 'forms/models/email'
import { MobilePhone } from 'forms/models/mobilePhone'
import { PartyDetails } from 'forms/models/partyDetails'
import { Address } from 'forms/models/address'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'
import { Defendant } from 'drafts/models/defendant'
import { IndividualDetails } from 'forms/models/individualDetails'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { generateString } from '../../../app/forms/models/validationUtils'

const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')

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
      draft.defendantDetails.email = new Email('test@test.com')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party address is invalid', () => {
      const inValidAddress = new Address('', '', '', '', '')

      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = inValidAddress
      draft.defendantDetails.email = new Email('test@test.com')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party correspondence address is invalid', () => {
      const invalidCorrespondenceAddress = new CorrespondenceAddress('', '', '', '', '')

      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.correspondenceAddress = invalidCorrespondenceAddress
      draft.defendantDetails.email = new Email('test@test.com')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual mobile phone is undefined', () => {
      const dateOfBirth: DateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))
      individualDetails.dateOfBirth = dateOfBirth

      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.mobilePhone = undefined
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is undefined', () => {
      let dateOfBirth = new DateOfBirth()
      individualDetails.dateOfBirth = dateOfBirth

      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is invalid', () => {
      const dateOfBirth: DateOfBirth = new DateOfBirth(true, new LocalDate(90, 11, 25))
      individualDetails.dateOfBirth = dateOfBirth

      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader mobile phone is undefined', () => {
      draft.defendantDetails = new Defendant(soleTraderDetails)
      draft.defendantDetails.mobilePhone = undefined
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader mobile phone is invalid', () => {
      draft.defendantDetails = new Defendant(soleTraderDetails)

      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company mobile phone is undefined', () => {
      draft.defendantDetails = new Defendant(companyDetails)
      draft.defendantDetails.mobilePhone = undefined
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company mobile phone is invalid', () => {
      draft.defendantDetails = new Defendant(companyDetails)
      const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')

      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation mobile phone is undefined', () => {
      draft.defendantDetails = new Defendant(organisationDetails)
      draft.defendantDetails.mobilePhone = undefined
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation mobile phone is invalid', () => {
      draft.defendantDetails = new Defendant(organisationDetails)

      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when', () => {

    it('defendant individual mobile phone is defined', () => {
      const dateOfBirth: DateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))
      individualDetails.dateOfBirth = dateOfBirth

      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both individual address and date of birth are valid', () => {
      const dateOfBirth: DateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))
      individualDetails.dateOfBirth = dateOfBirth

      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both sole trader address and mobile phone are valid', () => {
      draft.defendantDetails = new Defendant(soleTraderDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both company address and mobile phone are valid', () => {
      draft.defendantDetails = new Defendant(companyDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both organisation address and mobile phone are valid', () => {
      draft.defendantDetails = new Defendant(organisationDetails)
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })
  })
})
