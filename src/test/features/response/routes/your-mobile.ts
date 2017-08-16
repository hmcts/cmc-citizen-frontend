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

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant user details: your mobile page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.defendantMobilePage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.defendantMobilePage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('response')

          await request(app)
            .get(ResponsePaths.defendantMobilePage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('What is your mobile number?'))
        })
      })
    })

  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ResponsePaths.defendantMobilePage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', ResponsePaths.defendantMobilePage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')

            await request(app)
              .post(ResponsePaths.defendantMobilePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('What is your mobile number?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.rejectSave('response', 'HTTP error')

            await request(app)
              .post(ResponsePaths.defendantMobilePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ number: '07123456789' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.resolveSave('response')

            await request(app)
              .post(ResponsePaths.defendantMobilePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ number: '07123456789' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
          })
        })
      })
    })
  })
})
