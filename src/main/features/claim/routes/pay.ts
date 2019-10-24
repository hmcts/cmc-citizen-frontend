import * as express from 'express'
import * as config from 'config'

import { Paths } from 'claim/paths'

import { GovPayClient, PayClient } from 'payment-hub-client/payClient'
import { Payment } from 'payment-hub-client/payment'

import { FeesClient } from 'fees/feesClient'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { buildURL } from 'utils/callbackBuilder'
import { draftClaimAmountWithInterest } from 'shared/interestUtils'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Logger } from '@hmcts/nodejs-logging'
import { FeeOutcome } from 'fees/models/feeOutcome'
import { Fee } from 'payment-hub-client/fee'
import { PaymentRetrieveResponse } from 'payment-hub-client/paymentRetrieveResponse'
import * as HttpStatus from 'http-status-codes'
import { FeatureToggles } from 'utils/featureToggles'
import { trackCustomEvent } from 'logging/customEventTracker'
import { Claim } from 'claims/models/claim'
import { MockPayClient } from 'mock-clients/mockPayClient'
import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

const logger = Logger.getLogger('router/pay')
const event: string = config.get<string>('fees.issueFee.event')
const channel: string = config.get<string>('fees.channel.online')

const getPayClient = async (req: express.Request): Promise<PayClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  if (FeatureToggles.isEnabled('mockPay')) {
    return new MockPayClient(req.url)
  }
  return new GovPayClient(authToken)
}

const getReturnURL = (req: express.Request, externalId: string) => {
  return buildURL(req, Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
}

function logPaymentError (id: string, payment: Payment) {
  logError(id, payment, 'Payment might have failed, see payment information: ')
}

function logError (id: string, payment: Payment, message: string) {
  logger.error(`${message} (User Id : ${id}, Payment: ${JSON.stringify(payment)})`)
}

async function successHandler (req, res, next) {
  const draft: Draft<DraftClaim> = res.locals.claimDraft
  const user: User = res.locals.user
  const externalId: string = draft.document.externalId
  let savedClaim: Claim

  try {
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    if (!roles.length) {
      logger.error(`missing consent not given role for user, User Id : ${user.id}`)
    }

    const features = await FeaturesBuilder.features(draft, user)

    savedClaim = await claimStoreClient.saveClaim(draft, user, features)

  } catch (err) {
    if (err.statusCode === HttpStatus.INTERNAL_SERVER_ERROR || err.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
      logError(
        user.id,
        draft.document.claimant.payment,
        `Payment processed successfully but there was a problem saving claim '${externalId}' to the claim store.`
      )
      trackCustomEvent(`Post payment successful but unable to store claim in claim-store with externalId: ${externalId}`,
        {
          externalId: externalId,
          payment: draft.document.claimant.payment,
          error: err
        })
      next(err)
      return
    } else if (err.statusCode === HttpStatus.CONFLICT) {
      logError(
        user.id,
        draft.document.claimant.payment,
        `Payment processed successfully and claim ${externalId} already exists.`
      )
      savedClaim = await claimStoreClient.retrieveByExternalId(externalId, user)
    }
  }

  if (!savedClaim) {
    throw new Error(`Error saving claim: ${externalId}`)
  }

  const payClient: PayClient = await getPayClient(req)
  const paymentReference = draft.document.claimant.payment.reference
  const ccdCaseNumber = savedClaim.ccdCaseId === undefined ? 'UNKNOWN' : String(savedClaim.ccdCaseId)
  await payClient.update(user, paymentReference, savedClaim.externalId, ccdCaseNumber)
  await new DraftService().delete(draft.id, user.bearerToken)
  res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPaymentReceiver.uri, async (req, res, next) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    const externalId: string = draft.document.externalId

    try {
      if (!externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
      }
      const amount: number = await draftClaimAmountWithInterest(draft.document)
      if (!amount) {
        throw new Error('No amount entered, you cannot pay yet')
      }

      const paymentRef = draft.document.claimant.payment ? draft.document.claimant.payment.reference : undefined

      if (paymentRef) {
        const payClient: PayClient = await getPayClient(req)
        const paymentResponse: PaymentRetrieveResponse = await payClient.retrieve(user, paymentRef)
        if (paymentResponse !== undefined) {
          if (paymentResponse.status === 'Success') {
            return res.redirect(Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
          }
        } else if (draft.document.claimant.payment['state'] && draft.document.claimant.payment['state']['status'] === 'success') {
          logError(user.id, draft.document.claimant.payment, 'Successful payment from V1 version of the API cannot be handled')
        }
      }

      const feeOutcome: FeeOutcome = await FeesClient.calculateFee(event, amount, channel)
      const payClient: PayClient = await getPayClient(req)
      const payment: Payment = await payClient.create(
        user,
        externalId,
        [new Fee(feeOutcome.amount, feeOutcome.code, feeOutcome.version)],
        getReturnURL(req, draft.document.externalId)
      )
      draft.document.claimant.payment = payment
      await new DraftService().save(draft, user.bearerToken)

      res.redirect(payment._links.next_url.href)
    } catch (err) {

      trackCustomEvent(`Pre payment error for externalId: ${externalId}`,{
        externalId: externalId,
        payment: draft.document.claimant.payment,
        error: err
      })

      logPaymentError(user.id, draft.document.claimant.payment)
      next(err)
    }
  })
  .get(Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user

    try {
      const { externalId } = req.params

      const paymentReference = draft.document.claimant.payment.reference
      if (!paymentReference) {
        return res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
      }
      const payClient = await getPayClient(req)

      const payment: PaymentRetrieveResponse = await payClient.retrieve(user, paymentReference)
      draft.document.claimant.payment = payment

      await new DraftService().save(draft, user.bearerToken)

      const status: string = payment.status
      // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
      switch (status) {
        case 'Cancelled':
        case 'Failed':
          logPaymentError(user.id, payment)
          res.redirect(Paths.checkAndSendPage.uri)
          break
        case 'Success':
          await successHandler(req, res, next)
          break
        default:
          logPaymentError(user.id, payment)
          next(new Error(`Payment failed. Status ${status} is returned by the service`))
      }
    } catch (err) {
      const { externalId } = req.params
      trackCustomEvent(`Post payment error for externalId: ${externalId}`,{
        externalId: externalId,
        payment: draft.document.claimant.payment,
        error: err
      })
      logPaymentError(user.id, draft.document.claimant.payment)
      next(err)
    }
  })
