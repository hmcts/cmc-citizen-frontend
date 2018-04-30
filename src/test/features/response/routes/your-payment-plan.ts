import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkNotDefendantInCaseGuard } from './checks/not-defendant-in-case-check'

import { Paths, StatementOfMeansPaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { PartyType } from 'app/common/partyType'
import { ResponseType } from 'response/form/models/responseType'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId })
const statementOfMeansStartPage = StatementOfMeansPaths.startPage.evaluateUri({ externalId: externalId })
const taskListPage = Paths.taskListPage.evaluateUri({ externalId: externalId })

describe('Defendant: payment page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'claimant')
      })

      context('when user authorised', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
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

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your payment plan'))
        })
      })
    })
  })

  describe('on POST', () => {
    const validFormData = {
      remainingAmount: 160,
      instalmentAmount: 30.00,
      firstPaymentDate: {
        day: 12,
        month: 3,
        year: 2050
      },
      paymentSchedule: 'EVERY_MONTH',
      text: 'I owe nothing'
    }

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve response draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should redirect to statement of means start page if defendant is individual', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', {
            response: {
              type: ResponseType.FULL_ADMISSION
            },
            defendantDetails: {
              partyDetails: {
                type: PartyType.INDIVIDUAL.value
              }
            }
          })
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(statementOfMeansStartPage))
        })

        it('should redirect to task list page if defendant is company', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', {
            response: {
              type: ResponseType.FULL_ADMISSION
            },
            defendantDetails: {
              partyDetails: {
                type: PartyType.COMPANY.value
              }
            }
          })
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(taskListPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with error messages', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: undefined })
            .expect(res => expect(res).to.be.successful.withText('Your payment plan'))
        })
      })
    })
  })
})
