import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as moment from 'moment'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths as OfferPaths } from 'offer/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/offer/routes/checks/authorization-check'

import { LocalDate } from 'forms/models/localDate'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const confirmationPage = OfferPaths.offerConfirmationPage.evaluateUri({ externalId: externalId })
const offerPage = OfferPaths.offerPage.evaluateUri({ externalId: externalId })

const validFormData = {
  offerText: 'Offer Text',
  completionDate: new LocalDate(2030, 11, 11)
}

describe('Offer page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', offerPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(offerPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(offerPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Your offer'))
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', offerPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(offerPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', async () => {
          it('should redirect to offer confirmation page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveSaveOffer()
            const futureDate = moment().add(1, 'day')
            const formData = {
              offerText: 'Offer Text',
              completionDate: new LocalDate(futureDate.year(), futureDate.month() + 1, futureDate.date())
            }
            await request(app)
              .post(offerPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
          })

          it('should return 500 and render error page when cannot save offer', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectSaveOfferForDefendant()

            await request(app)
              .post(offerPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when provided date is in past', async () => {
          it('should render page with error', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            await request(app)
              .post(offerPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({
                offerText: 'Offer Text',
                completionDate: new LocalDate(1980, 1, 1)
              })
              .expect(res => expect(res).to.be.successful.withText('Enter an offer date in the future', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
