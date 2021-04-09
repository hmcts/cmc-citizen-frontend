import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsLiftCheckAnswersPage.uri

describe('Breathing Space: Lift check-answer page', () => {
  context('when user authorised', () => {
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
    })

    context('Breathing Space Lift check your answer', () => {
      it('should render page when everything is fine', function (done) {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Are you sure you want to lift the debt respite scheme?'))
        done()
      })

      it('should render the page with all the values', function (done) {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: date.date(), month: date.month() - 1, year: date.year() } })
          .expect(res => expect(res).to.be.successful.withText('Are you sure you want to lift the debt respite scheme?'))
          .expect(res => expect(res).to.be.successful)
        done()
      })
    })
  })

  describe('on POST', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when submitted', () => {
        it('should redirect to dashboard-claimant details page', function (done) {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

          request(app)
            .post(pagePath)
            .send({ breathingSpaceLiftedbyInsolvencyTeamDate: '2021-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a' })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).has.redirect)
          done()
        })
      })
    })
  })
})
