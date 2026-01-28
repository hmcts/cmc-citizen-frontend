import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'
import { getSessionCookie } from 'test/auth-helper'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'

const pagePath: string = Paths.startPage.uri

describe('Claim eligibility: index page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath, () => sessionCookie)

    context('when user is logged in', () => {
      it('should render page when everything is fine', async () => {
        const sessionCookie = await getSessionCookie(app)
        idamServiceMock.resolveRetrieveUserFor('1')

        await request(app)
          .get(pagePath)
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.successful.withText('Find out if you can make a claim using this service'))
      })
    })

    context('when user is logged out', () => {
      it('should render page when everything is fine', async () => {

        await request(app)
          .get(pagePath)
          .expect(res => expect(res).to.be.successful.withText('Try the new online service'))
      })
    })
  })
})
