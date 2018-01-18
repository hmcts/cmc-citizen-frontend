import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as feesServiceMock from '../../../http-mocks/fees'
import { SignatureType } from 'app/common/signatureType'
import { mockCalculateInterestRate } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.checkAndSendPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should redirect to incomplete submission when not all tasks are completed', async () => {
        draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false })

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.incompleteSubmissionPage.uri))
      })

      it('should return 500 and render error page when cannot calculate fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee('HTTP error')
        mockCalculateInterestRate(0)

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        mockCalculateInterestRate(0)

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your claim'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.checkAndSendPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should redirect to incomplete submission when not all tasks are completed', async () => {
        draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false })

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.incompleteSubmissionPage.uri))
      })

      it('should return 500 and render error page when form is invalid and cannot calculate fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee('HTTP error')
        mockCalculateInterestRate(0)

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        mockCalculateInterestRate(0)

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your claim', 'div class="error-summary"'))
      })

      it('should redirect to payment page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPaymentReceiver.uri))
      })
    })
  })
})
