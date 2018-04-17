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

describe('Your details task', () => {

  context('should not be completed when', () => {
    it('response is undefined', () => {
      const draft = new ResponseDraft()

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant details is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party details is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails.partyDetails = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party address is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = undefined
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party address is invalid', () => {
      const draft = new ResponseDraft()
      const inValidAddress = new Address('', '', '', '', '')

      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.address = inValidAddress
      draft.defendantDetails.email = new Email('test@test.com')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant party correspondence address is invalid', () => {
      const draft = new ResponseDraft()
      const inValidAddress = new CorrespondenceAddress('', '', '', '', '')

      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.correspondenceAddress = inValidAddress
      draft.defendantDetails.email = new Email('test@test.com')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is undefined', () => {
      const draft = new ResponseDraft()
      let individualDetails: IndividualDetails = new IndividualDetails()
      let dateOfBirth = new DateOfBirth()

      individualDetails.dateOfBirth = dateOfBirth
      draft.defendantDetails = new Defendant(individualDetails)
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant individual date of birth is invalid', () => {
      const draft = new ResponseDraft()
      let individualDetails: IndividualDetails = new IndividualDetails()
      const dob: DateOfBirth = new DateOfBirth(true, new LocalDate(90, 11, 25))
      individualDetails.dateOfBirth = dob
      draft.defendantDetails = new Defendant(individualDetails)

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader mobile phone is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new SoleTraderDetails())
      draft.defendantDetails.mobilePhone = undefined
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant sole trader mobile phone is invalid', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new SoleTraderDetails())
      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company mobile phone is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new CompanyDetails())
      draft.defendantDetails.mobilePhone = undefined

      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant company mobile phone is invalid', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new CompanyDetails())
      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation mobile phone is undefined', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new OrganisationDetails())
      draft.defendantDetails.mobilePhone = undefined
      expect(YourDetails.isCompleted(draft)).to.be.false
    })

    it('defendant organisation mobile phone is invalid', () => {
      const draft = new ResponseDraft()
      draft.defendantDetails = new Defendant(new OrganisationDetails())
      draft.defendantDetails.mobilePhone = new MobilePhone(generateString(31))
      expect(YourDetails.isCompleted(draft)).to.be.false
    })
  })

  context('should be completed when', () => {
    it('both individual address and date of birth are valid', () => {
      const draft = new ResponseDraft()

      let individualDetails: IndividualDetails = new IndividualDetails()
      const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')
      const dob: DateOfBirth = new DateOfBirth(true, new LocalDate(1981, 11, 11))
      individualDetails.dateOfBirth = dob
      draft.defendantDetails = new Defendant(individualDetails)
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both sole trader address and mobile phone are valid', () => {
      const draft = new ResponseDraft()
      let soleTraderDetails: SoleTraderDetails = new SoleTraderDetails()

      draft.defendantDetails = new Defendant(soleTraderDetails)
      const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both company address and mobile phone are valid', () => {
      const draft = new ResponseDraft()
      let companyDetails: CompanyDetails = new CompanyDetails()

      draft.defendantDetails = new Defendant(companyDetails)
      const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })

    it('both organisation address and mobile phone are valid', () => {
      const draft = new ResponseDraft()
      let organisationDetails: OrganisationDetails = new OrganisationDetails()

      draft.defendantDetails = new Defendant(organisationDetails)
      const validAddress = new Address('line1', 'line2', 'line3', 'city', 'postcode')
      draft.defendantDetails.mobilePhone = new MobilePhone('09998877777')
      draft.defendantDetails.partyDetails.address = validAddress

      expect(YourDetails.isCompleted(draft)).to.be.true
    })
  })
})
