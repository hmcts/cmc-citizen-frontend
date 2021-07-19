import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsCheckAnswersPage.uri

describe('Breathing Space: check-answer page', () => {

  describe('on GET', () => {
    attachDefaultHooks(app)
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })
      context('Breathing Space check your answer', () => {
        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('bs')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
        })

        it('should render the page with all the values', async () => {
          draftStoreServiceMock.resolveFind('bs')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED', bsEndDate: '2025-01-01', breathingSpaceEndDate: '2021-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a', breathingSpaceReferenceNumber: 'BS-1234567890' })
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
        })
      })
    })
  })

  describe('on POST', () => {
    attachDefaultHooks(app)
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('when not submitted', () => {
        it('should redirect to dashboard-claimant details page', async () => {
          checkAuthorizationGuards(app, 'post', pagePath)
          draftStoreServiceMock.resolveFind('bs')
          draftStoreServiceMock.resolveDelete(100)

          await request(app)
            .post(pagePath)
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED' })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).has.redirect)
        })
      })
    })
  })
})
