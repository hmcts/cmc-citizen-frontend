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
import { RoutablePath } from 'common/router/routablePath'

const cookieName: string = config.get<string>('session.cookieName')

describe('CCJ guard', () => {
  attachDefaultHooks()
  describe('on GET', () => {
    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      context('should redirect to dashboard when claim not eligible for CCJ', () => {
        Object.values(Paths).forEach((path: RoutablePath) => {
          const route: string = path.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })

          it(`for ${route} route`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ respondedAt: MomentFactory.currentDateTime() })

            await request(app)
              .get(route)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
          })
        })
      })
    })
  })
})
