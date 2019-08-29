import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { PartyType } from 'common/partyType'
import { checkNotClaimantInCaseGuard } from 'test/features/ccj/routes/checks/not-claimant-in-case-check'

const sampleClaimObj = claimStoreServiceMock.sampleClaimObj

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const paidAmountPage = Paths.paidAmountPage.uri.replace(':externalId', externalId)
const pagePath = Paths.dateOfBirthPage.uri.replace(':externalId', externalId)

function checkAccessGuard (app: any, method: string) {
  PartyType.except(PartyType.INDIVIDUAL).forEach(partyType => {
    it(`should redirect to dashboard page when defendant type is ${partyType.name.toLocaleLowerCase()}`, async () => {
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({
        claim: {
          ...sampleClaimObj.claim,
          defendants: [{
            ...sampleClaimObj.claim.defendants[0],
            type: partyType.value
          }]
        }
      })
      draftStoreServiceMock.resolveFind('ccj')

      await request(app)[method](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
    })
  })
}

describe('CCJ - defendant date of birth', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      checkAccessGuard(app, method)

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('ccj')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Do you know the defendant’s date of birth?'))
      })
    })
  })

  describe('on POST', () => {
    const validFormData = { known: 'true', date: { day: '31', month: '12', year: '1900' } }

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      checkAccessGuard(app, method)

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save ccj draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to paid amount page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(paidAmountPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: undefined })
            .expect(res => expect(res).to.be.successful.withText('Do you know the defendant’s date of birth?', 'div class="error-summary"'))
        })
      })
    })
  })
})
