import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'paid-in-full/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/paid-in-full/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/paid-in-full/routes/checks/not-claimant-in-case-check'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = Paths.datePaidPage.evaluateUri({ externalId: externalId })

describe.only('claim - date money was received', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve paidInFull draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('paidInFull')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('When did you receive the money?'))
      })
    })
  })

  describe('on POST', () => {
    const validFormData = { date: { day: '31', month: '12', year: '2000' } }

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve paidInFull draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      // EXPECTING 500 BUT GETS 404: expects nothing but gets draft
      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save paidInFull draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('paidInFull')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when form is invalid', async () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('paidInFull')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ date: { day: '31', month: '12', year: '2020' } })
            .expect(res => expect(res).to.be.successful.withText('When did you receive the money?', 'div class="error-summary"'))
        })
      })
    })
  })
})
