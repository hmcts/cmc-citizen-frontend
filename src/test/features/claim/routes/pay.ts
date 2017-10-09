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
import { InterestType } from 'app/forms/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import Claimant from 'app/drafts/models/claimant'
import DraftClaim from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { Address } from 'forms/models/address'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import ClaimAmountRow from 'forms/models/claimAmountRow'
import Interest from 'forms/models/interest'
import InterestDate from 'forms/models/interestDate'
import Reason from 'forms/models/reason'

const draftType = 'claim'

const cookieName: string = config.get<string>('session.cookieName')
const issueFeeCode: string = config.get<string>('fees.issueFee.code')

let overrideClaimDraftObj

describe('Claim issue: initiate payment receiver', () => {
  attachDefaultHooks()

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
            id: '12',
            amount: 2500,
            state: { status: 'success' }
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
          email: {address: 'example@example.com' }
        } as Defendant,
        amount: {
          rows: [{reason: 'Valid reason',amount: 1} as ClaimAmountRow]
        } as ClaimAmountBreakdown,
        interest: {
          type: InterestType.NO_INTEREST
        } as Interest,
        interestDate: {} as InterestDate,
        reason: {
          reason: 'Valid reason'
        } as Reason
      } as DraftClaim
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
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
      feesServiceMock.rejectCalculateFee(issueFeeCode)

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj )
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot create payment', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(issueFeeCode)
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
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveCreate()
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to next page when everything is fine', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      feesServiceMock.resolveCalculateFee(issueFeeCode)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveCreate()
      draftStoreServiceMock.resolveSave()

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation('/claim-confirmed'))
    })

    it('should redirect to pay receiver page when pay status is success', async () => {
      draftStoreServiceMock.resolveFind(draftType)
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveRetrieve('success')

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.finishPaymentReceiver.evaluateUri({ externalId: sampleClaimDraftObj.externalId })))
    })
  })
})

describe('Claim issue: post payment callback receiver', () => {
  attachDefaultHooks()

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
            id: '12',
            amount: 2500,
            state: { status: 'success' }
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
          email: {address: 'example@example.com' }
        } as Defendant,
        amount: {
          rows: [{reason: 'Valid reason',amount: 1} as ClaimAmountRow]
        } as ClaimAmountBreakdown,
        interest: {
          type: InterestType.NO_INTEREST
        } as Interest,
        interestDate: {} as InterestDate,
        reason: {
          reason: 'Valid reason'
        } as Reason
      } as DraftClaim
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
    })

    function initiatedPayment (): object {
      overrideClaimDraftObj.claimant.payment = { id: 12, amount: 2500, state: { status: 'created' } }
      return overrideClaimDraftObj
    }

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
      idamServiceMock.rejectRetrieveServiceToken()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.rejectRetrieve()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve payment', async () => {
      draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
      idamServiceMock.resolveRetrieveServiceToken()
      payServiceMock.resolveRetrieve('success')
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(Paths.finishPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    describe('when retrieved payment', () => {
      describe('failed', () => {
        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('failed')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('got cancelled', () => {
        it('should redirect to the check and send page', async () => {
          draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('cancelled')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(Paths.checkAndSendPage.uri))
        })
      })

      describe('succeeded', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
          idamServiceMock.resolveRetrieveServiceToken()
          payServiceMock.resolveRetrieve('success')
          draftStoreServiceMock.resolveSave()
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Server is down')

          await request(app)
            .get(Paths.finishPaymentReceiver.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        describe('when claim already exists', () => {
          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${sampleClaimDraftObj.externalId}/confirmation`))
          })

          it('should redirect to confirmation page when payment is missing', async () => {
            draftStoreServiceMock.resolveFind(draftType, { claimant: undefined })

            await request(app)
              .get(Paths.finishPaymentReceiver.evaluateUri({ externalId: sampleClaimDraftObj.externalId }))
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${sampleClaimDraftObj.externalId}/confirmation`))
          })
        })

        describe('when claim does not exist', () => {
          it('should return 500 and render error page when cannot save claim', async () => {
            draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('Claim not found by external id')
            claimStoreServiceMock.rejectSaveClaimForUser()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot delete draft', async () => {
            draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('success')
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
            draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('success')
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
          draftStoreServiceMock.resolveFind(draftType, initiatedPayment())
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
