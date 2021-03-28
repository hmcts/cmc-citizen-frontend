import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as BreathingSpacePaths } from 'breathing-space/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = BreathingSpacePaths.bsCheckAnswersPage.uri

describe('Breathing Space: check-answer page', () => {

  describe('on GET', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('Breathing Space check your answer', () => {
        it('should render page when everything is fine', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
        })

        it('should render the page with all the values', async () => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED', bsEndDate: '2025-01-01', breathingSpaceEndDate: '2021-01-01', breathingSpaceExternalId: 'bbb89313-7e4c-4124-8899-34389312033a', breathingSpaceReferenceNumber: 'BS-1234567890' })
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting'))
            .expect(res => expect(res).to.be.successful.withText('Mental health crisis moratorium'))
        })
      })
    })
  })

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
            .send({ breathingSpaceType: 'STANDARD_BS_ENTERED' })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
        })
      })
    })
  })
})
