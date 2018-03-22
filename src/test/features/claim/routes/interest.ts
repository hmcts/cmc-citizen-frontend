import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkEligibilityGuards } from './checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { InterestType } from 'claim/form/models/interest'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: interest page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.interestPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.interestPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.interestPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Interest'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.interestPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.interestPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.interestPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Interest', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.interestPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestType.STANDARD })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to interest date page when form is valid, standard interest selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.interestPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestType.STANDARD })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.interestDatePage.uri))
      })

      it('should redirect to interest date page when form is valid, different interest selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.interestPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestType.DIFFERENT, rate: '9', reason: 'Special case' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.interestDatePage.uri))
      })

      it('should redirect to total page when form is valid, no interest selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.interestPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestType.NO_INTEREST })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.feesPage.uri))
      })
    })
  })
})
