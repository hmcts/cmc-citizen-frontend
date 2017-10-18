import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { Paths as OfferPaths } from 'offer/paths'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { app } from '../../../../main/app'
import * as idamServiceMock from '../../../http-mocks/idam'
import * as moment from 'moment'
import { LocalDate } from 'forms/models/localDate'

const externalId = sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const offerPage = OfferPaths.offerPage.evaluateUri({ externalId: externalId })
const confirmationPage = OfferPaths.offerConfirmationPage.evaluateUri({ externalId: externalId })

describe.skip('Offer page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', offerPage)
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor('1', 'defendant')
    })

    it('should render page when everything is fine', async () => {
      await request(app)
        .get(offerPage)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your offer'))
    })
  })

  describe('on POST', () => {
    it('should render page with errors when form is invalid', async () => {
      await request(app)
        .post(offerPage)
        .send({ content: '', completionDate: '' })
        .expect(res => expect(res).to.be.successful.withText("You haven't made your offer", 'div class="error-summary"'))
    })

    it('should redirect to offer confirmation page when form is valid and everything is fine', async () => {
      const futureDate = moment().add(10, 'days')
      const date = new LocalDate(futureDate.year(), futureDate.month(), futureDate.day())
      await request(app)
        .post(offerPage)
        .send({ content: 'offer text', completionDate: date })
        .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
    })
  })
})
