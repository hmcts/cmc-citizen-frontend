import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

const howMediationWorksPage = Paths.howFreeMediationWorksPage.uri

describe('Dashboard - How mediation works page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', howMediationWorksPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when everything is fine', async () => {
        await request(app)
          .get(howMediationWorksPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('A mediator phones you'))
      })
    })
  })
})
