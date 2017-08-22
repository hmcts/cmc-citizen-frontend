import { attachDefaultHooks } from '../../../routes/hooks'
import * as idamServiceMock from '../../../http-mocks/idam'
import '../../../routes/expectations'

import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as request from 'supertest'
import { app } from '../../../../main/app'
import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import * as config from 'config'
import { expect } from 'chai'
import { MomentFactory } from 'common/momentFactory'

const theirDetailsPage = Paths.theirDetailsPage.uri.replace(':externalId', 'b17af4d2-273f-4999-9895-bce382fa24c8')
const cookieName: string = config.get<string>('session.cookieName')

describe('CCJ guard', () => {
  attachDefaultHooks()
  describe('on GET', () => {
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })
      it('should redirect to dashboard when claim not eligible for CCJ', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ respondedAt: MomentFactory.currentDateTime() })

        await request(app)
          .get(theirDetailsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
      })
    })
  })
})
