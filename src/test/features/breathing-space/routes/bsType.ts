import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')

describe('Breathing Space: BS Type selection page', () => {
  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      request(app)
        .get(BreathingSpacePaths.bsTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('What type is it?'))
    })
  })

  describe('on POST', () => {
    attachDefaultHooks(app)
    checkAuthorizationGuards(app, 'post', BreathingSpacePaths.bsTypePage.uri)
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when form is invalid', async () => {
        draftStoreServiceMock.resolveFind('bs')

        await request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: undefined })
          .expect(res => expect(res).to.be.successful.withText('What type is it?', 'div class="error-summary"'))
      })

      it('should redirect to bs-end-date page when type selected ', async () => {
        draftStoreServiceMock.resolveFind('bs')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: 'STANDARD_BS_ENTERED' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsEndDatePage.uri))
      })

      it('should redirect to bs-end-date page when type selected', async () => {
        draftStoreServiceMock.resolveFind('bs')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(BreathingSpacePaths.bsTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ option: 'MENTAL_BS_ENTERED' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsEndDatePage.uri))
      })
    })
  })
})
