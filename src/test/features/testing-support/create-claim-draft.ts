///<reference path="../../../main/app/drafts/draft-data/claimDraft.ts"/>
import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import '../../routes/expectations'

import { Paths } from 'testing-support/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../../main/app'

import * as idamServiceMock from '../../http-mocks/idam'
import * as draftStoreServiceMock from '../../http-mocks/draft-store'

import { attachDefaultHooks } from '../../routes/hooks'
import { checkAuthorizationGuards } from '../../routes/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.createClaimDraftPage.uri
const pageText: string = 'Create Claim Draft'
const draftSuccessful: string = ClaimPaths.checkAndSendPage.uri

describe('Testing Support: Create Claim Draft', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('100', 'citizen')
      })

      it('should render page when everything is fine', async () => {
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageText))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('100', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        draftStoreServiceMock.rejectFind('HTTP Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot save claim draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to check and send page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.redirect
            .toLocation(draftSuccessful))
      })
    })
  })
})
