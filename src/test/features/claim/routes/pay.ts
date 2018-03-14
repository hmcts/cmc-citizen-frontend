import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { Paths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as feesServiceMock from '../../../http-mocks/fees'
import * as payServiceMock from '../../../http-mocks/pay'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { Interest, InterestType } from 'claim/form/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import { Claimant } from 'app/drafts/models/claimant'
import { DraftClaim } from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import { Payment } from 'payment-hub-client/payment'
import { Address } from 'forms/models/address'
import { DateOfBirth } from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow } from 'claim/form/models/claimAmountRow'
import { InterestDate } from 'claim/form/models/interestDate'
import { Reason } from 'claim/form/models/reason'

const draftType = 'claim'

const cookieName: string = config.get<string>('session.cookieName')
const event: string = config.get<string>('fees.issueFee.event')
const channel: string = config.get<string>('fees.channel.online')
const failureMessage: string = 'failure message'

let overrideClaimDraftObj

describe('Claim issue: initiate payment receiver', () => {

  attachDefaultHooks(app)

  checkAuthorizationGuards(app, 'get', Paths.startPaymentReceiver.uri)

  describe('for authorized user', () => {

    beforeEach(() => {
      overrideClaimDraftObj = {
        externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
        readResolveDispute: true,
        readCompletingClaim: true,
        claimant: {
          partyDetails: {
            type: 'individual',
            name: 'John Smith',
            address: {
              line1: 'Apt 99',
              city: 'London',
              postcode: 'E1'
            } as Address,
            hasCorrespondenceAddress: false,
            dateOfBirth: {
              known: true,
              date: {
                day: 31,
                month: 12,
                year: 1980
              } as LocalDate
            } as DateOfBirth
          } as IndividualDetails,
          mobilePhone: {
            number: '07000000000'
          } as MobilePhone,
          payment: {
            reference: '123',
            date_created: 12345,
            amount: 2500,
            status: 'Success',
            _links: {
              next_url: {
                href: 'any href',
                method: 'POST'
              }
            }
          } as Payment
        } as Claimant,
        defendant: {
          partyDetails: {
            type: 'individual',
            name: 'Rose Smith',
            address: {
              line1: 'Apt 99',
              city: 'London',
              postcode: 'E1'
            },
            hasCorrespondenceAddress: false
          } as IndividualDetails,
          email: { address: 'example@example.com' }
        } as Defendant,
        amount: {
          rows: [{ reason: 'Valid reason', amount: 1 } as ClaimAmountRow]
        } as ClaimAmountBreakdown,
        interest: {
          type: InterestType.NO_INTEREST
        } as Interest,
        interestDate: {} as InterestDate,
        reason: {
          reason: 'Valid reason'
        } as Reason
      } as DraftClaim
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    })

    it('should return 500 and error page when draft external ID does not exist', async () => {
      draftStoreServiceMock.resolveFind(draftType, { externalId: undefined, claimant: { payment: undefined } })

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot calculate issue fee', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.rejectCalculateFee(event, channel, failureMessage)

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(event, channel)
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot create payment', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(event, channel)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.rejectCreate()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot save draft', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(event, channel)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveCreate()
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should initiate new payment and redirect to next page when payment does not exist for given reference', async () => {
      overrideClaimDraftObj.claimant.payment.state = {
        status: 'success'
      }

      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      payServiceMock.resolveRetrieveToNotFound()
      feesServiceMock.resolveCalculateFee(event, channel)
      payServiceMock.resolveCreate()
      draftStoreServiceMock.resolveSave()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8'))
    })

    it('should redirect to next page when everything is fine', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(event, channel)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveCreate()
      draftStoreServiceMock.resolveSave()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8'))
    })

    it('should redirect to pay receiver page when pay status is success', async () => {
      draftStoreServiceMock.resolveFind(draftType)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveRetrieve('Success')

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.finishPaymentReceiver.evaluateUri({ externalId: draftStoreServiceMock.sampleClaimDraftObj.externalId })))
    })
  })
})

describe('Claim issue: post payment callback receiver', () => {

  attachDefaultHooks(app)

  checkAuthorizationGuards(app, 'get', Paths.finishPaymentReceiver.uri)

  describe('for authorized user', () => {

    beforeEach(() => {
      overrideClaimDraftObj = {
        externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
        readResolveDispute: true,
        readCompletingClaim: true,
        claimant: {
          partyDetails: {
            type: 'individual',
            name: 'John Smith',
            address: {
              line1: 'Apt 99',
              city: 'London',
              postcode: 'E1'
            } as Address,
            hasCorrespondenceAddress: false,
            dateOfBirth: {
              known: true,
              date: {
                day: 31,
                month: 12,
                year: 1980
              } as LocalDate
            } as DateOfBirth
          } as IndividualDetails,
          mobilePhone: {
            number: '07000000000'
          } as MobilePhone,
          payment: {
            reference: '123',
            date_created: 12345,
            amount: 2500,
            status: 'Success',
            _links: { next_url: { href: 'any href', method: 'POST' } }
          } as Payment
        } as Claimant,
        defendant: {
          partyDetails: {
            type: 'individual',
            name: 'Rose Smith',
            address: {
              line1: 'Apt 99',
              city: 'London',
              postcode: 'E1'
            },
            hasCorrespondenceAddress: false
          } as IndividualDetails,
          email: { address: 'example@example.com' }
        } as Defendant,
        amount: {
          rows: [{ reason: 'Valid reason', amount: 1 } as ClaimAmountRow]
        } as ClaimAmountBreakdown,
        interest: {
          type: InterestType.NO_INTEREST
        } as Interest,
        interestDate: {} as InterestDate,
        reason: {
          reason: 'Valid reason'
        } as Reason
      } as DraftClaim
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
    })

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.rejectRetrieve()

      await request(app)
        .get(Paths.finishPaymentReceiver.evaluateUri({ externalId: 'xyz' }))
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveRetrieve('Success')
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    describe('when retrieved payment', () => {

      describe('failed', () => {

        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('Failed')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('got cancelled', () => {

        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('Cancelled')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('succeeded', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('Success')
          draftStoreServiceMock.resolveSave()
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Server is down')

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        describe('when claim already exists', () => {

          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${draftStoreServiceMock.sampleClaimDraftObj.externalId}/confirmation`))
          })

          it('should redirect to confirmation page when payment is missing', async () => {
            draftStoreServiceMock.resolveFind(draftType, { claimant: undefined })

            await request(app)
              .get(Paths.finishPaymentReceiver.evaluateUri({ externalId: draftStoreServiceMock.sampleClaimDraftObj.externalId }))
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${draftStoreServiceMock.sampleClaimDraftObj.externalId}/confirmation`))
          })
        })

        describe('when claim does not exist', () => {

          it('should return 500 and render error page when cannot save claim', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.rejectSaveClaimForUser()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/400f4c57-9684-49c0-adb4-4cf46579d6dc/confirmation`))
          })
        })
      })

      describe('has unknown status', () => {

        it('should return 500 and render error page', async () => {
          draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('unknown')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })
    })
  })
})
