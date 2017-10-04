import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { ErrorPaths as ClaimErrorPaths, Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as feesServiceMock from '../../../http-mocks/fees'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: total page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.totalPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.totalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.totalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Total amount you’re claiming'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.totalPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should redirect to task list when amount within limit and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.totalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ totalAmount: '299' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })

      it('should redirect to amount exceeded page when amount above limit and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.totalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ totalAmount: '10000.01' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimErrorPaths.amountExceededPage.uri))
      })
    })
  })
})
