import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsLiftCheckAnswersPage.uri

describe('Breathing Space: Lift check-answer page', () => {
  attachDefaultHooks(app)
  context('when user authorised', () => {
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('bs')
    })

    context('Breathing Space Lift check your answer', () => {
      it('should render page when everything is fine', async () => {
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Are you sure you want to lift the debt respite scheme?'))
      })

      it('should redirect to dashboard-claimant details page', async () => {
        checkAuthorizationGuards(app, 'post', pagePath)
        draftStoreServiceMock.resolveDelete(100)
        await request(app)
          .post(pagePath)
          .send({ breathingSpaceLiftedbyInsolvencyTeamDate: '2021-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a' })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).has.redirect)
      })

      it('should render the page with all the values', async () => {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: date.date(), month: date.month() - 1, year: date.year() } })
          .expect(res => expect(res).to.be.successful.withText('Are you sure you want to lift the debt respite scheme?'))
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
