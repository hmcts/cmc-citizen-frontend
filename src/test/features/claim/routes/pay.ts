import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { Paths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { sampleClaimDraftObj } from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as feesServiceMock from '../../../http-mocks/fees'
import * as payServiceMock from '../../../http-mocks/pay'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'

const serviceToken = 'token'
const draftType = 'claim'

const cookieName: string = config.get<string>('session.cookieName')
const issueFeeCode: string = config.get<string>('fees.issueFee.code')

describe('Claim issue: initiate payment receiver', () => {
  attachDefaultHooks()

  checkAuthorizationGuards(app, 'get', Paths.startPaymentReceiver.uri)

  describe('for authorized user', () => {
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
    })

    it('should return 500 and error page when draft external ID does not exist', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { externalId: undefined, claimant: { payment: undefined } })

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot calculate issue fee', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { claimant: { payment: undefined } })
      feesServiceMock.rejectCalculateFee(issueFeeCode)

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { claimant: { payment: undefined } })
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot create payment', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { claimant: { payment: undefined } })
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.rejectCreate()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot save draft', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { claimant: { payment: undefined } })
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.resolveCreate()
      draftStoreServiceMock.rejectSave(draftType, 'HTTP error')

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to next page when everything is fine', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, { claimant: { payment: undefined } })
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.resolveCreate()
      draftStoreServiceMock.resolveSave(draftType)

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('/claim-confirmed'))
    })

    it('should redirect to pay receiver page when pay status is success', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType)
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.resolveRetrieve('success')

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.finishPaymentReceiver.uri.replace(':externalId', sampleClaimDraftObj.externalId)))
    })
  })
})

describe('Claim issue: post payment callback receiver', () => {
  attachDefaultHooks()

  checkAuthorizationGuards(app, 'get', Paths.finishPaymentReceiver.uri)

  describe('for authorized user', () => {
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
    })

    function initiatedPayment (): object {
      return {
        claimant: {
          name: { name: 'John Smith' },
          partyDetails: {
            address: {
              line1: 'Apt 99',
              city: 'London',
              postcode: 'E1'
            },
            hasCorrespondenceAddress: false
          },
          payment: { id: 12, amount: 2500, state: { status: 'created' } },
          dateOfBirth: {
            date: {
              day: '31',
              month: '12',
              year: '1980'
            }
          }
        }
      }
    }

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.rejectRetrieve()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
      idamServiceMock.resolveRetrieveServiceToken(serviceToken)
      payServiceMock.resolveRetrieve('success')
      draftStoreServiceMock.rejectSave(draftType, 'Service is down')

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    describe('when retrieved payment', () => {
      describe('failed', () => {
        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken(serviceToken)
          payServiceMock.resolveRetrieve('failed')
          draftStoreServiceMock.resolveSave(draftType)

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('got cancelled', () => {
        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken(serviceToken)
          payServiceMock.resolveRetrieve('cancelled')
          draftStoreServiceMock.resolveSave(draftType)

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('succeeded', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken(serviceToken)
          payServiceMock.resolveRetrieve('success')
          draftStoreServiceMock.resolveSave(draftType)
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Server is down')

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        describe('when claim already exists', () => {
          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken(serviceToken)
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectDelete(draftType, 'Server is down')

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken(serviceToken)
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveDelete(draftType)

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${sampleClaimDraftObj.externalId}/confirmation`))
          })

          it('should redirect to confirmation page when payment is missing', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, { claimant: undefined })

            await request(app)
              .get(Paths.finishPaymentReceiver.uri.replace(':externalId', sampleClaimDraftObj.externalId))
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${sampleClaimDraftObj.externalId}/confirmation`))
          })
        })

        describe('when claim does not exist', () => {
          it('should return 500 and render error page when cannot save claim', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken(serviceToken)
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave(draftType)
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.rejectSaveClaimForUser()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken(serviceToken)
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave(draftType)
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.rejectDelete(draftType, 'HTTP error')

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken(serviceToken)
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave(draftType)
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.resolveDelete(draftType)

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/400f4c57-9684-49c0-adb4-4cf46579d6dc/confirmation`))
          })
        })
      })

      describe('has unknown status', () => {
        it('should return 500 and render error page', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken(serviceToken)
          payServiceMock.resolveRetrieve('unknown')
          draftStoreServiceMock.resolveSave(draftType)

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })
    })
  })
})
