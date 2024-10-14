import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as ClaimPaths } from 'claim/paths'

let app = require('main/app')

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as sinon from 'sinon'
import { FeatureToggles } from 'utils/featureToggles'
import * as mock from 'nock'
import { defaultAccessDeniedPagePattern } from '../../../routes/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'

describe('Claim documents: receipt', () => {
  let isEnabledStub

  before(() => {
    isEnabledStub = sinon.stub(FeatureToggles, 'isEnabled').returns(true)
    delete require.cache[require.resolve('main/app')]
    const { app: reloadedApp } = require('main/app')
    app = reloadedApp
    attachDefaultHooks(app)
  })

  after(() => {
    isEnabledStub.restore()
  })

  describe('on GET', () => {
    const pagePath = ClaimPaths.receiptReceiver.evaluateUri({ externalId: externalId })

    it('should redirect to access denied page when JWT token is missing', async () => {
      await request(app)['get'](pagePath)
        .expect(res => expect(res).redirect.toLocation(defaultAccessDeniedPagePattern))
    })

    it('should redirect to access denied page when cannot retrieve user details (possibly session expired)', async () => {
      mock.cleanAll()
      idamServiceMock.rejectRetrieveUserFor('Response 403 from /details')

      await request(app)['get'](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).redirect.toLocation(defaultAccessDeniedPagePattern))
    })

    it('should redirect to access denied page when user not in required role', async () => {
      mock.cleanAll()
      idamServiceMock.resolveRetrieveUserFor('1', 'divorce-private-beta')

      await request.agent(app)['get'](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).redirect.toLocation(defaultAccessDeniedPagePattern))
    })

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.rejectRetrieveDocument('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.resolveRetrieveDocument()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
