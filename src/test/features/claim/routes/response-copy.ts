import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'

describe('Defendant response copy', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantResponseCopy.uri.replace(':externalId', externalId))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should return 500 and render error page when cannot download the response copy', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.rejectRetrieveDefendantResponseCopy('Something went wrong')

        await request(app)
          .get(ClaimPaths.defendantResponseCopy.uri.replace(':externalId', externalId))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when the user is not owner of claim', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ claimantId: 123 })

        await request(app)
          .get(ClaimPaths.defendantResponseCopy.uri.replace(':externalId', externalId))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.resolveRetrieveDefendantResponseCopy()

        await request(app)
          .get(ClaimPaths.defendantResponseCopy.uri.replace(':externalId', externalId))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
