import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: counter claim page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.counterClaimPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        draftStoreServiceMock.resolveRetrieve('response')
        claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

        await request(app)
          .get(ResponsePaths.counterClaimPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve('response')
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

        await request(app)
          .get(ResponsePaths.counterClaimPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.successful.withText('Complete and email the defence and counterclaim form by'))
      })
    })
  })
})
