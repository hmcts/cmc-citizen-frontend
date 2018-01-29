import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import '../../../../routes/expectations'
import { Paths, StatementOfMeansPaths } from 'response/paths'
import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import { attachDefaultHooks } from '../../../../routes/hooks'
import { checkAuthorizationGuards } from '../checks/authorization-check'
import { checkAlreadySubmittedGuard } from '../checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from '../checks/ccj-requested-check'
import { app } from '../../../../../main/app'
import { checkNotDefendantInCaseGuard } from '../checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.courtOrdersPage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

describe('Defendant response: Statement of means: debts', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {

    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response and CCJ not submitted', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Are you paying any other court orders?'))
        })
      })
    })
  })

  describe('on POST', () => {

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      describe('errors are handled properly', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      describe('save and continue', () => {

        context('should update draft store and redirect', () => {

          it('when valid debt provided', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .send({ hasAnyCourtOrders: 'true', rows: [{ details: 'my debt', amount: '100' }] })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.taskListPage.evaluateUri(
                  { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
                )
              )
          })

          it('when no selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .send({ hasAnyCourtOrders: 'false' })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.taskListPage.evaluateUri(
                  { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
                )
              )
          })
        })
      })

      describe('add a new row', () => {

        it('should add more rows', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .send({ action: { addRow: 'Add row' } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Are you paying any other court orders?'))
        })
      })
    })
  })
})
