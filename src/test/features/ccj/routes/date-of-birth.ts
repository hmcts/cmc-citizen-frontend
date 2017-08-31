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
const externalId = sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const paidAmountPage = Paths.paidAmountPage.uri.replace(':externalId', externalId)
const dateOfBirthPage = Paths.dateOfBirthPage.uri.replace(':externalId', externalId)

describe('CCJ - defendant date of birth', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', dateOfBirthPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
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
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')
          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: 'true', date: { day: '31', month: '12', year: '1900' } })
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve CCJ draft', async () => {
          draftStoreServiceMock.rejectRetrieve('ccj', 'Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: 'true', date: { day: '31', month: '12', year: '1900' } })
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
            .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
            .expect(res => expect(res).to.be.redirect.toLocation(paidAmountPage))
        })

        it('should return 500 and render error page when cannot save ccj draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.rejectSave('ccj', 'Error')

          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })
    })
  })
})
