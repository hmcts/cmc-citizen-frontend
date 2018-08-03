import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/response/routes/checks/authorization-check'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkNotDefendantInCaseGuard } from 'test/features/response/routes/checks/not-defendant-in-case-check'
import { Paths } from 'claimant-response/paths'
import { FreeMediationOption } from 'response/form/models/freeMediation'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const defendantPartialAdmissionResponse = claimStoreServiceMock.sampleDefendantPartialAdmissionResponseObj
const pagePath = Paths.freeMediationPage.evaluateUri({ externalId: externalId })

describe('Claimant response: free mediation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse', {
            freeMediation: {
              option: FreeMediationOption.NO
            }
          })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Free mediation'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Free mediation', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
            draftStoreServiceMock.resolveFind('claimantResponse',{
              freeMediation: {
                option: FreeMediationOption.YES
              }
            })
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
            draftStoreServiceMock.resolveFind('claimantResponse', {
              freeMediation: {
                option: FreeMediationOption.YES
              }
            })
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.taskListPage
                  .evaluateUri({ externalId: externalId })))
          })
        })
      })
    })
  })
})
