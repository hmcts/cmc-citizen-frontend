import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.moreTimeConfirmationPage.evaluateUri({ externalId: sampleClaimObj.externalId })

describe('Defendant response: more time needed - confirmation page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', pagePath)

      context('when response not submitted', () => {
        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('when answer is "no"', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })

        it('should render confirmation page when answer is "yes" and everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('You have an extra 14 days to respond'))
        })

        it('should return 500 and render error page when answer is "yes" and cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Internal server error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', pagePath)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        describe('should redirect to request more time page', () => {
          it('when no option is selected', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('when answer is "no', async () => {
            draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.redirect
                .toLocation(ResponsePaths.moreTimeRequestPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })

        it('should redirect to task list page when "yes" selected and everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect
              .toLocation(ResponsePaths.taskListPage
                .evaluateUri({ externalId: sampleClaimObj.externalId })))
        })
      })
    })
  })
})
