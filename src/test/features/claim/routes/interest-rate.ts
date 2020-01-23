import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { InterestRateOption } from 'claim/form/models/interestRateOption'

const cookieName: string = config.get<string>('session.cookieName')
const pageContent: string = 'What annual rate of interest do you want to claim?'
const pagePath: string = ClaimPaths.interestRatePage.uri

describe('Claim issue: interest rate page', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {

    checkAuthorizationGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageContent))
    })
  })

  describe('on POST', () => {

    checkAuthorizationGuards(app, 'post', pagePath)

    describe('for authorized user', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'))
      })

      it('should render the page when a different rate is selected but no rate is entered', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: InterestRateOption.DIFFERENT,
            reason: 'Special case'
          })
          .expect(res => expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'))
      })

      it('should render the page when a different rate is selected but no reason is entered', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: InterestRateOption.DIFFERENT,
            rate: '10'
          })
          .expect(res => expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestRateOption.STANDARD })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to interest date page when form is valid, 8% is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestRateOption.STANDARD })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.interestDatePage.uri))
      })

      it('should redirect to interest date page when form is valid, a different rate is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: InterestRateOption.DIFFERENT,
            rate: '10',
            reason: 'Special case'
          })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.interestDatePage.uri))
      })
    })
  })
})
