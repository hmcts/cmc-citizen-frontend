import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths, PayBySetDatePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { ResponseType } from 'response/form/models/responseType'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { checkNotDefendantInCaseGuard } from './checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.defencePaymentOptionsPage.evaluateUri({ externalId: externalId })

const validFormData: object = {
  option: DefendantPaymentType.INSTALMENTS.value
}

describe('Defendant - when will you pay options', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
      })

      context('when service is unhealthy', () => {
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
      })

      context('when service is healthy', () => {
        const fullAdmissionQuestion: string = 'When will you pay?'
        it(`should render page asking '${fullAdmissionQuestion}' when full admission was selected`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', {
            response: {
              type: ResponseType.FULL_ADMISSION
            }
          })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(fullAdmissionQuestion))
        })

        const partAdmissionQuestion: string = 'When will you pay the amount you admit you owe?'
        it(`should render page asking '${partAdmissionQuestion}' when partial admission was selected`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', {
            response: {
              type: ResponseType.PART_ADMISSION
            },
            rejectPartOfClaim: {
              option: RejectPartOfClaimOption.AMOUNT_TOO_HIGH
            }
          })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(partAdmissionQuestion))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotDefendantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
        })

        context('when service is unhealthy', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
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

          it('should return 500 when cannot save response draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when service is healthy', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', {
              response: {
                type: ResponseType.FULL_ADMISSION
              }
            })
          })

          context('when form is valid', async () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveSave()
            })

            async function checkThatSelectedPaymentOptionRedirectsToPage (data: object, expectedToRedirect: string) {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(data)
                .expect(res => expect(res).to.be.redirect.toLocation(expectedToRedirect))
            }

            it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: DefendantPaymentType.INSTALMENTS.value },
                Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to payment date page for "BY_SET_DATE" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: DefendantPaymentType.BY_SET_DATE.value },
                PayBySetDatePaths.paymentDatePage.evaluateUri({ externalId: externalId }))
            })
          })

          context('when form is invalid', async () => {
            it('should render page', async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ name: 'John Smith' })
                .expect(res => expect(res).to.be.successful.withText('When will you pay?'))
            })
          })
        })
      })
    })
  })
})
