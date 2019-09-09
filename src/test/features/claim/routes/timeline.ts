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

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ClaimPaths.timelinePage.uri

describe('Claim issue: timeline page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(
          'Timeline of events',
          'If you don’t know the exact date, tell us the month and year.'
        ))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)
    checkEligibilityGuards(app, 'post', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ rows: [{ 'date': 'may', 'description': 'ok' }] })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page with error when description missing', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ rows: [{ date: 'may' }] })
          .expect(res => expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'))
      })

      it('should render page with error when date missing', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ rows: [{ description: 'ok' }] })
          .expect(res => expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'))
      })

      it('should redirect to timeline when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ rows: [{ date: 'may', description: 'ok' }] })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.evidencePage.uri))
      })

      describe('add row action', () => {
        it('should render page when valid input', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' } })
            .expect(res => expect(res).to.be.successful.withText('Timeline of events'))
        })
      })
    })
  })
})
