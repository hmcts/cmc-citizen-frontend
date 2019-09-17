import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { FullRejectionPaths, Paths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = FullRejectionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId })

const validFormData = { amount: 100, date: { day: 1, month: 1, year: 1990 }, text: 'aaa' }
const header: string = 'How much have you paid?'

describe(`Defendant: reject all - ${header}`, () => {

  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it(`should render page asking '${header}' when full rejection was selected`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-rejection')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(header))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot save response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-rejection')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it('when form is invalid should render page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ totalAmountTillToday: validFormData.amount + 1 })
          draftStoreServiceMock.resolveFind('response:full-rejection')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.successful.withText(header, 'div class="error-summary"'))
        })

        testValidPost(-1, true,
          FullRejectionPaths.youHavePaidLessPage.evaluateUri({ externalId: externalId }))
        testValidPost(-1, false,
          Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
        testValidPost(0, true,
          Paths.taskListPage.evaluateUri({ externalId: externalId }))
        testValidPost(0, false,
          Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
        testValidPost(1, true,
          Paths.taskListPage.evaluateUri({ externalId: externalId }))
        testValidPost(1, false,
          Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
      })
    })
  })
})

function testValidPost (paidDifference: number, admissionsEnabled: boolean, redirect: string) {
  let difference: string
  if (paidDifference < 0) {
    difference = `£${Math.abs(paidDifference)} less than`
  } else if (paidDifference > 0) {
    difference = `£${paidDifference} greater than`
  } else {
    difference = 'the same as'
  }
  const admissionsOverride = admissionsEnabled ? {} : { features: undefined }

  it(`when form is valid having paid ${difference} the claimed amount`, async () => {
    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
      ...admissionsOverride,
      totalAmountTillToday: validFormData.amount - paidDifference
    })
    draftStoreServiceMock.resolveFind('response:full-rejection')
    draftStoreServiceMock.resolveFind('mediation')
    draftStoreServiceMock.resolveUpdate()

    await request(app)
      .post(pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .send(validFormData)
      .expect(res => expect(res).to.be.redirect.toLocation(redirect))
  })
}
