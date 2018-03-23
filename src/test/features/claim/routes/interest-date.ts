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
import { InterestDateType } from 'app/common/interestDateType'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: interest date page', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.interestDatePage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.interestDatePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.interestDatePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('When are you claiming interest from?'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.interestDatePage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.interestDatePage.uri)

    describe('for authorized user', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.interestDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('When are you claiming interest from?', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.interestDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestDateType.SUBMISSION })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to total page when form is valid, submission date selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.interestDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ type: InterestDateType.SUBMISSION })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.feesPage.uri))
      })

      it('should redirect to total page when form is valid, custom date selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.interestDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            type: InterestDateType.CUSTOM,
            date: { day: '31', month: '12', year: '2016' },
            reason: 'Special case'
          })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.feesPage.uri))
      })
    })
  })
})
