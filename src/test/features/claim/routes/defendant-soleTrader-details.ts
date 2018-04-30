import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkEligibilityGuards } from './checks/eligibility-check'
import { SoleTraderDetails } from 'app/forms/models/soleTraderDetails'
import { Paths as ClaimPaths } from 'claim/paths'
import { Address } from 'forms/models/address'
import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const input = {
  type: 'soleTrader',
  name: 'John Smith',
  address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } as Address,
  hasCorrespondenceAddress: false,
  businessName: 'businessName'
} as SoleTraderDetails
const theirName: string = 'Full name (include title)'

describe('defendant as soleTrader details page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(theirName))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when claimant name is invalid', async () => {
        draftStoreServiceMock.resolveFind('claim')
        const nameMissingInput = { ...input, ...{ name: '' } }
        await request(app)
          .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(nameMissingInput)
          .expect(res => expect(res).to.be.successful.withText(theirName, 'div class="error-summary"', 'Enter name'))
      })
      describe('should render page with error when address is invalid', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFind('claim')
        })
        it('line 1 is missing', async () => {
          const invalidAddressInput = { ...input, ...{ address: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirName, 'div class="error-summary"', 'Enter first address line'))
        })
        it('postcode is missing', async () => {
          const invalidAddressInput = { ...input, ...{ address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } } }
          await request(app)
            .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirName, 'div class="error-summary"', 'Enter postcode'))
        })
      })

      describe('should render page with error when selected Correspondence address option and Correspondence entered is invalid', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFind('claim')
        })
        it('line 1 is missing', async () => {
          const invalidCorrespondenceAddressInput = { ...input, ...{ hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } } }
          await request(app)
            .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidCorrespondenceAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirName, 'div class="error-summary"', 'Enter first correspondence address line'))
        })
        it('postcode is missing', async () => {
          const invalidCorrespondenceAddressInput = { ...input, ...{ hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } } }
          await request(app)
            .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send(invalidCorrespondenceAddressInput)
            .expect(res => expect(res).to.be.successful.withText(theirName, 'div class="error-summary"', 'Enter correspondence address postcode'))
        })
      })

      it('should redirect to data of birth page when everything is fine ', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()
        await request(app)
          .post(ClaimPaths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(input)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantEmailPage.uri))
      })
    })
  })
})
