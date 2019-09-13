import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { ErrorPaths as ClaimErrorPaths, Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: amount page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.amountPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.amountPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.amountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Claim amount'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.amountPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.amountPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      describe('add row action', () => {
        it('should render page when form is invalid and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' } })
            .expect(res => expect(res).to.be.successful.withText('Claim amount'))
        })

        it('should render page when form is valid, amount within limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' }, rows: [{ reason: 'Damaged roof', amount: '299' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount'))
        })

        it('should render page when form is valid, amount above limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' }, rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount'))
        })
      })

      describe('calculate action', () => {
        it('should render page when form is invalid and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { calculate: 'Calculate' } })
            .expect(res => expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'))
        })

        it('should render page when form is valid, amount within limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { calculate: 'Calculate' }, rows: [{ reason: 'Damaged roof', amount: '299' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount'))
        })

        it('should render page when form is valid, amount above limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { calculate: 'Calculate' }, rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount'))
        })
      })

      describe('save action', () => {
        it('should render page when form is invalid and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'))
        })

        it('should render page when reason is given but no amount', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ rows: [{ reason: 'Damaged roof' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'))
        })

        it('should render page when amount is given but no reasons', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ rows: [{ amount: '299' }] })
            .expect(res => expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'))
        })

        it('should return 500 and render error page when form is valid, amount within limit and cannot save draft', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ rows: [{ reason: 'Damaged roof', amount: '299' }] })
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to interest page when form is valid, amount within limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ rows: [{ reason: 'Damaged roof', amount: '299' }] })
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.interestPage.uri))
        })

        it('should redirect to amount exceeded page when form is valid, amount above limit and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(ClaimPaths.amountPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
            .expect(res => expect(res).to.be.redirect.toLocation(ClaimErrorPaths.amountExceededPage.uri))
        })
      })
    })
  })
})
