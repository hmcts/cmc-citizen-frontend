import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Paths as ClaimPaths } from 'claim/paths'
import { Address } from 'forms/models/address'
import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const input = {
  type: 'individual',
  firstName: 'John',
  lastName: 'Smith',
  address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } as Address,
  hasCorrespondenceAddress: false
} as IndividualDetails
const theirFirstName = 'First name'
const theirLastName = 'Last name'
const theirTitle = 'Title'

describe('defendant as individual details page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantIndividualDetailsPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.defendantIndividualDetailsPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.defendantIndividualDetailsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantIndividualDetailsPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.defendantIndividualDetailsPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when defendant first name is invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')
        const nameMissingInput = { ...input, ...{ firstName: '', lastName: 'ok' } }
        await request(app)
          .post(ClaimPaths.defendantIndividualDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(nameMissingInput)
          .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter first name'))
      })
      it('should render page with error when defendant lastName is invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')
        const nameMissingInput = { ...input, ...{ firstName: 'ok', lastName: '' } }
        await request(app)
          .post(ClaimPaths.defendantIndividualDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(nameMissingInput)
          .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter last name'))
      })
      it('should render page with error when defendant first name and last name are invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')
        const nameMissingInput = { ...input, ...{ firstName: '', lastName: '' } }
        await request(app)
          .post(ClaimPaths.defendantIndividualDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(nameMissingInput)
          .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter first name', 'Enter last name'))
      })
      describe('should render page with error when address is invalid', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFind('claim')
        })
        it('line 1 is missing', async () => {
          const invalidAddressInput = { ...input, ...{ address: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter first address line'))
        })
        it('city is missing', async () => {
          const invalidAddressInput = { ...input, ...{ address: { line1: 'Apartment 99', line2: '', line3: '', city: '', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter a valid town/city'))
        })
        it('postcode is missing', async () => {
          const invalidAddressInput = { ...input, ...{ address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter postcode'))
        })
      })

      describe('should render page with error when selected Correspondence address option and Correspondence entered is invalid', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFind('claim')
        })
        it('line 1 is missing', async () => {
          const invalidCorrespondenceAddressInput = { ...input, ...{ hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidCorrespondenceAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter first correspondence address line'))
        })
        it('city is missing', async () => {
          const invalidCorrespondenceAddressInput = { ...input, ...{ hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: 'Apartment 99', line2: '', line3: '', city: '', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidCorrespondenceAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter correspondence town/city'))
        })
        it('postcode is missing', async () => {
          const invalidCorrespondenceAddressInput = { ...input, ...{ hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } } }
          await request(app)
            .post(ClaimPaths.defendantIndividualDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidCorrespondenceAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirTitle, theirFirstName, theirLastName, 'div class="error-summary"', 'Enter correspondence address postcode'))
        })
      })

      it('should redirect to defendant email page when everything is fine ', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()
        await request(app)
          .post(ClaimPaths.defendantIndividualDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(input)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantEmailPage.uri))
      })
    })
  })
})
