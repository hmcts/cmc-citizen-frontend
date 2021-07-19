
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
const headerText: string = 'Reference number must not be more than 16 characters'
const bsNumberPagePath = BreathingSpacePaths.referencNumberPage.evaluateUri({ externalId: draftStoreServiceMock.sampleClaimDraftObj.externalId })

describe('Breathing space: reference number page page', () => {

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      checkAuthorizationGuards(app, 'get', bsNumberPagePath)
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('bs')
      draftStoreServiceMock.resolveUpdate()
      request(app)
        .get(bsNumberPagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ bsNumber: '07000000000' })
        .expect(res => expect(res).to.be.successful.withText('Do you have a Debt Respite Scheme reference number?'))
    })
  })

  describe('on POST', () => {
    attachDefaultHooks(app)
    checkAuthorizationGuards(app, 'post', bsNumberPagePath)
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('bs')

        await request(app)
          .post(bsNumberPagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ bsNumber: 'BS-12345678909876' })
          .expect(res => expect(res).to.be.successful.withText(headerText, 'div class="error-summary"'))
      })

      it('should redirect to Start date page when form is valid and nothing is submitted', async () => {
        draftStoreServiceMock.resolveFind('bs')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(bsNumberPagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ bsNumber: '' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsStartDatePage.uri))
      })

      it('should redirect to start date page when form is valid and number is provided', async () => {
        draftStoreServiceMock.resolveFind('bs')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(bsNumberPagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ bsNumber: '07000000000' })
          .expect(res => expect(res).to.be.redirect.toLocation(BreathingSpacePaths.bsStartDatePage.uri))
      })
    })
  })
})
