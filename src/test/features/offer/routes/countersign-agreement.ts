import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import '../../../routes/expectations'

import { app } from '../../../../main/app'
import { Paths as OfferPaths } from 'offer/paths'
import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const countersignAgreementPage = OfferPaths.countersignAgreementPage.evaluateUri({ externalId: externalId })

describe('Countersign agreement page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', countersignAgreementPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(countersignAgreementPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(countersignAgreementPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You can now make a legal agreement'))
      })
    })
  })
})
