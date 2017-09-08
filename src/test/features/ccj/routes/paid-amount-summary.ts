import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = sampleClaimObj.externalId
const paidAmountSummaryPage = Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })

describe('CCJ - paid amount summary page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', paidAmountSummaryPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(paidAmountSummaryPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(paidAmountSummaryPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve('ccj')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(paidAmountSummaryPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Amount to be paid by defendant'))
      })
    })
  })
})
