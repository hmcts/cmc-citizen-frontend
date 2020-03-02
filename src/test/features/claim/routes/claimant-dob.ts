import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: claimant date of birth page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantDateOfBirthPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.claimantDateOfBirthPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.claimantDateOfBirthPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('What is your date of birth?'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantDateOfBirthPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.claimantDateOfBirthPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is empty and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.claimantDateOfBirthPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('What is your date of birth?', 'div class="error-summary"'))
      })

      it('should render page with error when DOB is less than 18', async () => {
        draftStoreServiceMock.resolveFind('claim')
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        await request(app)
          .post(ClaimPaths.claimantDateOfBirthPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ known: 'true', date: { day: date.date(), month: date.month() + 1, year: date.year() } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a date of birth before', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(ClaimPaths.claimantDateOfBirthPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to claimant phone page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.claimantDateOfBirthPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantPhonePage.uri))
      })
    })
  })
})
