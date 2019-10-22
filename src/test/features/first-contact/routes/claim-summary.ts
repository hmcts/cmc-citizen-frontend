import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/first-contact/routes/checks/authorization-check'

import { ErrorPaths, Paths } from 'first-contact/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { MomentFactory } from 'shared/momentFactory'
import { EvidenceType } from 'forms/models/evidenceType'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant first contact: claim summary page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.claimSummaryPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder')
      })

      it('should redirect to access denied page when not eligible page claim reference number does not match', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('100MC001')

        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.claimSummaryAccessDeniedPage.uri))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveByLetterHolderId('HTTP error')

        await request(app)
          .get(`${Paths.claimSummaryPage.uri}`)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 200 and render view when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('100MC001')
        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC;state=100MC001`)
          .expect(res => expect(res).to.be.successful.withText('Claim details'))
      })

      it('should include evidence section when evidence was provided', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId(
          '100MC001',
          {
            claim: {
              ...claimStoreServiceMock.sampleClaimObj.claim,
              evidence: { rows: [{ type: EvidenceType.PHOTO.value, description: 'my photo evidence' }] }
            }
          }
        )

        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC;state=100MC001`)
          .expect(res => expect(res).to.be.successful.withText('Evidence'))
      })

      it('should not include evidence section when evidence was not provided', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId(
          '100MC001',
          { claim: { ...claimStoreServiceMock.sampleClaimObj.claim, evidence: null } }
        )

        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC;state=100MC001`)
          .expect(res => expect(res).to.be.successful.withoutText('Evidence'))
      })

    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', Paths.claimSummaryPage.uri)

    it('should redirect to registration page when everything is fine', async () => {
      const registrationPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/uplift\\?response_type=code&state=1&client_id=cmc_citizen&redirect_uri=https://127.0.0.1:[0-9]{5}/receiver&jwt=ABC`)

      idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder')

      await request(app)
        .post(Paths.claimSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(registrationPagePattern))
    })
    it('should clear session cookie when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder')

      await request(app)
        .post(Paths.claimSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })
  })

  describe('CCJ was requested', () => {
    it('should redirect to ccj error page', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder')
      claimStoreServiceMock.resolveRetrieveByLetterHolderId(
        '100MC000', { countyCourtJudgmentRequestedAt: MomentFactory.parse('2010-10-10') }
      )

      await request(app)
        .get(Paths.claimSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC;state = 100MC000`)
        .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.ccjRequestedHandoffPage.uri))
    })
  })
})
