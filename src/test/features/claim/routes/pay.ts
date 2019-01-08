import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { Paths as ClaimPaths, Paths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as featureToggleApiMock from 'test/http-mocks/feature-toggle-store'

import * as feesServiceMock from 'test/http-mocks/fees'
import * as payServiceMock from 'test/http-mocks/pay'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'
import { Defendant } from 'drafts/models/defendant'
import { Claimant } from 'drafts/models/claimant'
import { DraftClaim } from 'drafts/models/draftClaim'
import { IndividualDetails } from 'forms/models/individualDetails'
import { MobilePhone } from 'forms/models/mobilePhone'
import { Payment } from 'payment-hub-client/payment'
import { Address } from 'forms/models/address'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow } from 'claim/form/models/claimAmountRow'
import { InterestDate } from 'claim/form/models/interestDate'
import { Reason } from 'claim/form/models/reason'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { Interest } from 'claim/form/models/interest'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { YesNoOption } from 'models/yesNoOption'

const draftType = 'claim'

const cookieName: string = config.get<string>('session.cookieName')
const event: string = config.get<string>('fees.issueFee.event')
const channel: string = config.get<string>('fees.channel.online')
const failureMessage: string = 'failure message'
const externalId: string = draftStoreServiceMock.sampleClaimDraftObj.externalId

let overrideClaimDraftObj

describe('Claim issue: initiate payment receiver', () => {
  attachDefaultHooks(app)

  checkAuthorizationGuards(app, 'get', Paths.startPaymentReceiver.uri)
  checkEligibilityGuards(app, 'get', ClaimPaths.startPaymentReceiver.uri)

  describe('for authorized user', () => {

    beforeEach(() => {
      overrideClaimDraftObj = {
        externalId: externalId,
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
          option: YesNoOption.YES
        } as Interest,
        interestType: {
          option: InterestTypeOption.SAME_RATE
        } as InterestType,
        interestRate: {
          type: InterestRateOption.DIFFERENT,
          rate: 10,
          reason: 'Special case'
        } as InterestRate,
        interestDate: {
          type: InterestDateType.SUBMISSION
        } as InterestDate,
        interestStartDate: {
          date: {
            day: 10,
            month: 12,
            year: 2016
          },
          reason: 'reason'
        } as InterestStartDate,
        interestEndDate: {
          option: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestEndDate,
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
      claimStoreServiceMock.resolvePrePaymentSave()
      feesServiceMock.rejectCalculateFee(event, channel, failureMessage)

      await request(app)
        .get(Paths.startPaymentReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
      overrideClaimDraftObj.claimant.payment = undefined
      draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj)
      claimStoreServiceMock.resolvePrePaymentSave()
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
      claimStoreServiceMock.resolvePrePaymentSave()
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
      claimStoreServiceMock.resolvePrePaymentSave()
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
      claimStoreServiceMock.resolvePrePaymentSave()
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
      claimStoreServiceMock.resolvePrePaymentSave()
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
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId })))
    })
  })
})

describe('Claim issue: post payment callback receiver', () => {
  attachDefaultHooks(app)

  checkAuthorizationGuards(app, 'get', Paths.finishPaymentReceiver.uri)
  checkEligibilityGuards(app, 'get', ClaimPaths.finishPaymentReceiver.uri)

  describe('for authorized user', () => {

    beforeEach(() => {
      overrideClaimDraftObj = {
        externalId: externalId,
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
          option: YesNoOption.YES
        } as Interest,
        interestType: {
          option: InterestTypeOption.SAME_RATE
        } as InterestType,
        interestRate: {
          type: InterestRateOption.DIFFERENT,
          rate: 10,
          reason: 'Special case'
        } as InterestRate,
        interestDate: {
          type: InterestDateType.SUBMISSION
        } as InterestDate,
        interestStartDate: {
          date: {
            day: 10,
            month: 12,
            year: 2016
          },
          reason: 'reason'
        } as InterestStartDate,
        interestEndDate: {
          option: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestEndDate,
        reason: {
          reason: 'Valid reason'
        } as Reason
      } as DraftClaim
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
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
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`))
          })

          it('should redirect to confirmation page when payment is missing', async () => {
            draftStoreServiceMock.resolveFind(draftType, { claimant: undefined })

            await request(app)
              .get(Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`))
          })
        })

        describe('when claim does not exist', () => {

          it('should return 500 and render error page when cannot save claim', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')
            featureToggleApiMock.resolveIsAdmissionsAllowed()
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
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            featureToggleApiMock.resolveIsAdmissionsAllowed()
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 404 and render error page when feature toggle api fails', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')
            featureToggleApiMock.rejectIsAdmissionsAllowed()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.notFound)
          })

          it('should return 500 and render error page when retrieve user roles fails', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            claimStoreServiceMock.rejectRetrieveUserRoles()

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
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given')
            featureToggleApiMock.resolveIsAdmissionsAllowed()
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`))
          })

          it('should redirect to confirmation page when user have not given any consent', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse)
            idamServiceMock.resolveRetrieveServiceToken()
            payServiceMock.resolveRetrieve('Success')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode('Claim not found by external id')
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-not-given')
            featureToggleApiMock.resolveIsAdmissionsAllowed(false)
            claimStoreServiceMock.resolveSaveClaimForUser()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .get(Paths.finishPaymentReceiver.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`))
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
