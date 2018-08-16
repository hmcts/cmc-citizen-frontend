import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/response/routes/checks/authorization-check'
import { ResponseType } from 'response/form/models/responseType'
import { checkNotDefendantInCaseGuard } from 'test/features/response/routes/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.howMuchHaveYouPaid.evaluateUri({ externalId: externalId })

const validFormData = { amount: 100, date: { day: 1, month: 1, year: 1990 }, text: 'aaa' }
const header: string = 'How much have you paid?'

describe(`Defendant: reject all - ${header}`, () => {

  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it(`should render page asking '${header}' when full rejection was selected`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', {
            response: {
              type: ResponseType.DEFENCE
            }
          })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(header))
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

        context('when service is unhealthy', () => {
          it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot retrieve response draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectFind('Error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot save response draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when service is healthy', () => {
          context('when amount paid is less than that claimed', async () => {
            beforeEach(() => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId({ totalAmountTillToday: validFormData.amount + 1 })
              draftStoreServiceMock.resolveFind('response')
            })

            it('when form is valid should render `you have paid less` page', async () => {
              draftStoreServiceMock.resolveSave()
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(Paths.youHavePaidLess.evaluateUri({ externalId: externalId })))
            })

            it('when form is invalid should render page', async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ amount: -100 })
                .expect(res => expect(res).to.be.successful.withText(header, 'div class="error-summary"'))
            })
          })

          context('when amount paid is equal to that claimed', async () => {
            beforeEach(() => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId({ totalAmountTillToday: validFormData.amount })
              draftStoreServiceMock.resolveFind('response')
            })

            it('when form is valid should render task list page', async () => {
              draftStoreServiceMock.resolveSave()
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.redirect
                  .toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))
            })
          })
        })
      })
    })
  })
})
