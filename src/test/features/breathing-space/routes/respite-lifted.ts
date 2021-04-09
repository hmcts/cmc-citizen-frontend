import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')

describe('Lift breathing space: Lift date page', () => {

  describe('on GET', () => {
    it('should render page when everything is fine', function (done) {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      request(app)
        .get(BreathingSpacePaths.bsLiftPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Date for lifting debt respite scheme (breathing space)'))
      done()
    })
  })

  describe('on POST', () => {
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when date is less than or equal to today', async () => {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: date.date(), month: date.month() + 2, year: date.year() + 1 } })
          .expect(res => expect(res).to.be.successful.withText('There was a problem'))
      })

      it('should redirect to check answer page when form is valid and everything is fine', async () => {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')

        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: '31', month: '12', year: date.year() - 1 } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsLiftCheckAnswersPage.uri))
      })

      it('should redirect to check answer page when form is valid (without date) and everything is fine', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: '', month: '', year: '' } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsLiftCheckAnswersPage.uri))
      })

      it('should render page with error when invalid day is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: '33', month: '', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })

      it('should render page with error when invalid month is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: '3', month: '18', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })

      it('should render page with error when invalid year is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsLiftPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteLiftDate: { day: '3', month: '3', year: '12345' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })
    })
  })
})
