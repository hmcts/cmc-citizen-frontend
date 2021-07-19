import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

describe('Enter breathing space: Respite end date page', () => {

  describe('on GET', () => {
    attachDefaultHooks(app)
    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('bs')

      await request(app)
        .get(BreathingSpacePaths.bsEndDatePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Expected end date'))
    })
  })

  describe('on POST', () => {
    attachDefaultHooks(app)
    checkAuthorizationGuards(app, 'post', BreathingSpacePaths.bsEndDatePage.uri)
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        draftStoreServiceMock.resolveFind('bs')
      })

      it('should render page with error when date is less than or equal to today', async () => {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: 30, month: 1, year: date.year() } })
          .expect(res => expect(res).to.be.successful.withText('Expected end date must not be before today', 'There was a problem'))
      })

      it('should redirect to check answer page when form is valid and everything is fine', async () => {
        const date: Moment = MomentFactory.currentDate().subtract(1, 'year')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: '31', month: '12', year: date.year() + 1 } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsCheckAnswersPage.uri))
      })

      it('should redirect to check answer page when form is valid (without date) and everything is fine', async () => {
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: '', month: '', year: '' } })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsCheckAnswersPage.uri))
      })

      it('should render page with error when invalid day is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: '33', month: '', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })

      it('should render page with error when invalid month is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: '3', month: '18', year: '2021' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })

      it('should render page with error when invalid year is provided', async () => {

        await request(app)
          .post(BreathingSpacePaths.bsEndDatePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ respiteEnd: { day: '3', month: '3', year: '12345' } })
          .expect(res => expect(res).to.be.successful.withText('Please enter a valid date', 'There was a problem'))
      })
    })
  })
})
