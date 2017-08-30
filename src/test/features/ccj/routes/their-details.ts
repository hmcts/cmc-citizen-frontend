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

const theirDetailsPage = Paths.theirDetailsPage.uri.replace(':externalId', 'b17af4d2-273f-4999-9895-bce382fa24c8')

const validFormData = {
  address: {
    line1: 'Apt 99',
    line2: '',
    city: 'London',
    postcode: 'E1'
  }
}

describe('CCJ - their details', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', theirDetailsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(theirDetailsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(theirDetailsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Confirm their details'))
      })
    })
    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', theirDetailsPage)
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
              .post(theirDetailsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation('/case/b17af4d2-273f-4999-9895-bce382fa24c8/ccj/date-of-birth'))
          })
        })
        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')

            await request(app)
              .post(theirDetailsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ name: 'John Smith' })
              .expect(res => expect(res).to.be.successful.withText('Confirm their details', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
