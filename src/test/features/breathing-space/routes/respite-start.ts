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

describe('Enter breathing space: Respite start date page', () => {

  describe('on GET', () => {
    it('should render page when everything is fine', function (done) {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      request(app)
        .get(BreathingSpacePaths.bsStartDatePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('When did it start?'))
      done()
    })
  })

  describe('on POST', () => {
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when date is greater than or equal to today', function (done) {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: date.date() + 1, month: date.month() + 2, year: date.year() + 1 } })
          .expect(res => expect(res).to.be.successful.withText('There was a problem'))
        done()
      })

      it('should redirect to type page when form is valid and everything is fine', function (done) {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')

        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: '31', month: '12', year: date.year() - 1 } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsTypePage.uri))
        done()
      })

      it('should redirect to type page when form is valid (without date) and everything is fine', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: '', month: '', year: '' } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsTypePage.uri))
        done()
      })

      it('should render page with error when invalid day is provided', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: '33', month: '', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
        done()
      })

      it('should render page with error when invalid month is provided', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: '3', month: '18', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
        done()
      })

      it('should render page with error when invalid day is provided', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsStartDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteStart: { day: '3', month: '3', year: '12345' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
        done()
      })
    })
  })
})
