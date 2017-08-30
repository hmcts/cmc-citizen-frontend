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

const dateOfBirthPage = Paths.dateOfBirthPage.uri.replace(':externalId', 'b17af4d2-273f-4999-9895-bce382fa24c8')

describe('CCJ - defendant date of birth', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', dateOfBirthPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The court will still enter the judgment for you'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', dateOfBirthPage)
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })
      context('when form is invalid', async () => {
        it('should return 500 and render error page and cannot save draft', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')
          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ date: { day: '31', month: '12', year: '1900' } })
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })
      context('when form is valid', async () => {
        it('should redirect to todo page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')
          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ date: { day: '31', month: '12', year: '1980' } })
            .expect(res => expect(res).to.be.redirect.toLocation('toDo'))
        })
      })
    })
  })
})
