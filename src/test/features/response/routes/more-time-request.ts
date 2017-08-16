import { expect } from 'chai'
import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: more time needed page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.moreTimeRequestPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.moreTimeRequestPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        describe('should render editable page', async () => {
          it('when no option selected', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .get(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?'))
          })

          it('when answer is "no"', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: MoreTimeNeededOption.NO } })

            await request(app)
              .get(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you want more time to respond?'))
          })
        })

        it('should redirect to confirmation page when answer is "yes"', async () => {
          draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

          await request(app)
            .get(ResponsePaths.moreTimeRequestPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.moreTimeConfirmationPage.uri))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ResponsePaths.moreTimeRequestPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', ResponsePaths.moreTimeRequestPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should redirect to confirmation page when already submitted answer is "yes"', async () => {
          draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: MoreTimeNeededOption.YES } })

          await request(app)
            .post(ResponsePaths.moreTimeRequestPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.moreTimeConfirmationPage.uri))
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(HttpStatus.OK)
              .expect(res => expect(res.text).to.include('Do you want more time to respond?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should redirect to task list page when "no" is selected and everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveSave('response')

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'no' })
              .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.taskListPage.uri))
          })

          it('should redirect to confirmation page page when "yes" is selected and everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveSave('response')
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', 1)
            claimStoreServiceMock.resolveRequestForMoreTime()

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.moreTimeConfirmationPage.uri))
          })

          it('should return 500 and render error page when "yes" is selected and cannot save draft', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.rejectSave('response', 'HTTP error')

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when "yes" is selected and cannot retrieve claim', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveSave('response')
            claimStoreServiceMock.rejectRetrieveByDefendantId('internal server error when retrieving claim')

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when "yes" is selected and cannot request more time', async () => {
            draftStoreServiceMock.resolveRetrieve('response', { moreTimeNeeded: { option: undefined } })
            draftStoreServiceMock.resolveSave('response')
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', 1)
            claimStoreServiceMock.rejectRequestForMoreTime('internal server error when requesting more time')

            await request(app)
              .post(ResponsePaths.moreTimeRequestPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })
      })
    })
  })
})
