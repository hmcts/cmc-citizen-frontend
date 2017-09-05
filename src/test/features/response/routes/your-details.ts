import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant user details: your name page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.defendantYourDetailsPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.defendantYourDetailsPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

          await request(app)
            .get(ResponsePaths.defendantYourDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('response')
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

          await request(app)
            .get(ResponsePaths.defendantYourDetailsPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Confirm your details'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ResponsePaths.defendantYourDetailsPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', ResponsePaths.defendantYourDetailsPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')

            await request(app)
              .post(ResponsePaths.defendantYourDetailsPage.uri)
              .send({ type: 'individual' })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.rejectSave('response', 'HTTP error')

            await request(app)
              .post(ResponsePaths.defendantYourDetailsPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', city: 'London', postcode: 'E10AA' } })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to your address page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.resolveSave('response')

            await request(app)
              .post(ResponsePaths.defendantYourDetailsPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', city: 'London', postcode: 'E10AA' } })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.defendantDateOfBirthPage.uri))
          })
        })
      })
    })
  })
})
