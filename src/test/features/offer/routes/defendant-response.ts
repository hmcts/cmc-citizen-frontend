import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { app } from '../../../../main/app'
import { Paths as OfferPaths } from 'offer/paths'
import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = sampleClaimObj.externalId
const defendantResponsePage = OfferPaths.defendantResponsePage.evaluateUri({ externalId: externalId })

describe.skip('defendant response page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defendantResponsePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'defendant')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(defendantResponsePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(defendantResponsePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Defendant’s response'))
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', defendantResponsePage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'defendant')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(defendantResponsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })
      })
    })
  })
})
