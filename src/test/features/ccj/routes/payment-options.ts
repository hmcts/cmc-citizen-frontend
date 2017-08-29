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

const cookieName: string = config.get<string>('session.cookieName')

const paymentOptionsPage = Paths.paymentOptionsPage.uri.replace(':externalId', 'b17af4d2-273f-4999-9895-bce382fa24c8')

describe('CCJ - payment options', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', paymentOptionsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(paymentOptionsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Payment options'))
      })
    })
    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', paymentOptionsPage)
      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
        })

        context('when form is valid', async () => {
          it('should redirect to todo page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.resolveSave('ccj')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.redirect.toLocation('todo'))
          })
        })
        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')

            await request(app)
              .post(paymentOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ name: 'John Smith' })
              .expect(res => expect(res).to.be.successful.withText('Payment options', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
