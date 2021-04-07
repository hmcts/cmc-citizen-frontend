import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsLiftCheckAnswersPage.uri

describe('Breathing Space: Lift check-answer page', () => {
  describe('on POST', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when response not submitted', () => {
        it('should redirect to dashboard-claimant details page', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

          await request(app)
            .post(pagePath)
            .send({ breathingSpaceLiftedbyInsolvencyTeamDate: '2025-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a' })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).has.redirect)
        })
      })
    })
  })
})
