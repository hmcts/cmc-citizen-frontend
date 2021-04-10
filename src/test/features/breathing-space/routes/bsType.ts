import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Breathing Space: BS Type selection page', () => {
  describe('on GET', () => {
    it('should render page when everything is fine', function (done) {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      request(app)
        .get(BreathingSpacePaths.bsTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('What type is it?'))
      done()
    })
  })

  describe('on POST', () => {
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when form is invalid', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: undefined })
          .expect(res => expect(res).to.be.successful.withText('What type is it?', 'div class="error-summary"'))
        done()
      })

      it('should redirect to bs-end-date page when type selected ', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: 'STANDARD_BS_ENTERED' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsEndDatePage.uri))
        done()
      })

      it('should redirect to sole trader details page when soleTrader party type selected ', function (done) {
        request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: 'MENTAL_BS_ENTERED' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsEndDatePage.uri))
        done()
      })
    })
  })
})
