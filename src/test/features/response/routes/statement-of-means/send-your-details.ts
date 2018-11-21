import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import { checkAuthorizationGuards } from 'test/features/response/routes/checks/authorization-check'
import { checkNotDefendantInCaseGuard } from 'test/features/response/routes/checks/not-defendant-in-case-check'
import { StatementOfMeansPaths, Paths } from 'response/paths'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as request from 'supertest'
import { expect } from 'chai'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as config from 'config'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = StatementOfMeansPaths.sendYourDetailsPage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('send your details page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return error page when unable to retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return error page when unable to retrieve draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return successful response when claim is retrieved', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('response:full-admission')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('your company or organisation’s most recent statement of accounts'))
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('response:full-admission', { statementOfMeans: undefined })
        draftStoreServiceMock.rejectSave()
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('response:full-admission', { statementOfMeans: undefined })
        draftStoreServiceMock.resolveSave()
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect
            .toLocation(Paths.taskListPage
              .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
