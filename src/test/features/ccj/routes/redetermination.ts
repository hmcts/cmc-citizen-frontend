import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/ccj/routes/checks/not-claimant-in-case-check'
import { MomentFactory } from 'shared/momentFactory'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { MadeBy } from 'claims/models/madeBy'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.redeterminationPage.evaluateUri({ externalId: externalId, madeBy: MadeBy.CLAIMANT.value })
const confirmationPage = Paths.redeterminationConfirmationPage.evaluateUri({ externalId: externalId })

const validFormData = {
  text: 'I feel Defendant can pay earlier and I need money sooner'
} as ReDetermination

describe('CCJ - re-determination page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
          respondedAt: MomentFactory.currentDateTime(),
          countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
          countyCourtJudgment: {
            defendantDateOfBirth: '1990-11-01',
            paidAmount: 2,
            paymentOption: 'INSTALMENTS',
            repaymentPlan: {
              instalmentAmount: 30,
              firstPaymentDate: '2018-11-11',
              paymentSchedule: 'EVERY_MONTH',
              completionDate: '2019-11-11',
              paymentLength: '12 months'
            },
            ccjType: CountyCourtJudgmentType.DETERMINATION
          },
          claimantResponse: {
            type: ClaimantResponseType.ACCEPTATION,
            amountPaid: 0
          }

        })

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Why do you believe the defendant can repay you sooner?'))
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotClaimantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', async () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              respondedAt: MomentFactory.currentDateTime(),
              countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
              countyCourtJudgment: {
                defendantDateOfBirth: '1990-11-01',
                paidAmount: 2,
                paymentOption: 'INSTALMENTS',
                repaymentPlan: {
                  instalmentAmount: 30,
                  firstPaymentDate: '2018-11-11',
                  paymentSchedule: 'EVERY_MONTH',
                  completionDate: '2019-11-11',
                  paymentLength: '12 months'
                },
                ccjType: CountyCourtJudgmentType.DETERMINATION
              },
              claimantResponse: {
                type: ClaimantResponseType.ACCEPTATION,
                amountPaid: 0
              }
            })
          })

          it('should redirect to redetermination confirmation page', async () => {

            claimStoreServiceMock.resolveSaveReDeterminationForExternalId(validFormData.text)
            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
          })

          it('should return 500 and render error page when cannot save determination', async () => {
            claimStoreServiceMock.rejectSaveReDeterminationForExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              respondedAt: MomentFactory.currentDateTime(),
              countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
              countyCourtJudgment: {
                defendantDateOfBirth: '1990-11-01',
                paidAmount: 2,
                paymentOption: 'INSTALMENTS',
                repaymentPlan: {
                  instalmentAmount: 30,
                  firstPaymentDate: '2018-11-11',
                  paymentSchedule: 'EVERY_MONTH',
                  completionDate: '2019-11-11',
                  paymentLength: '12 months'
                },
                ccjType: CountyCourtJudgmentType.DETERMINATION
              },
              claimantResponse: {
                type: ClaimantResponseType.ACCEPTATION,
                amountPaid: 0
              }
            })

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: undefined })
              .expect(res => expect(res).to.be.successful.withText('Enter a valid reason', 'div class="error-summary"'))
          })
        })

      })
    })
  })
})
