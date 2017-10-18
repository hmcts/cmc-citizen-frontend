import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { Paths as OfferPaths } from 'offer/paths'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { app } from '../../../../main/app'
import * as idamServiceMock from '../../../http-mocks/idam'

const externalId = sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const confirmationPage = OfferPaths.offerConfirmationPage.evaluateUri({ externalId: externalId })

describe.skip('Offer confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', confirmationPage)
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor(1, 'confirmationPage')
    })

    it('should render page when everything is fine', async () => {
      await request(app)
        .get(confirmationPage)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your offer has been sent'))
    })
  })
})
