import * as express from 'express'
import * as config from 'config'

import { Paths } from 'claim/paths'

import { PayClient } from 'app/pay/payClient'
import { Payment } from 'app/pay/payment'

import { FeesClient } from 'app/fees/feesClient'

import { ClaimStoreClient } from 'app/claims/claimStoreClient'
import { buildURL } from 'app/utils/callbackBuilder'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
import { User } from 'app/idam/user'
import { DraftService } from 'services/draftService'
import { ServiceAuthTokenFactoryImpl } from 'common/security/serviceTokenFactoryImpl'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Logger } from '@hmcts/nodejs-logging'
import { FeeOutcome } from 'fees/models/feeOutcome'
import { Fees } from 'app/pay/fees'
import { PaymentResponse } from 'app/pay/paymentResponse'

const logger = Logger.getLogger('router/pay')
const event: string = config.get<string>('fees.issueFee.event')
const channel: string = config.get<string>('fees.channel.online')

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  return new PayClient(authToken)
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

async function successHandler (res, next) {
  const draft: Draft<DraftClaim> = res.locals.claimDraft
  const user: User = res.locals.user

  let claimStatus: boolean
  try {
    claimStatus = await ClaimStoreClient.retrieveByExternalId(draft.document.externalId, user)
      .then(() => true)
  } catch (err) {
    if (err.toString().includes('Claim not found by external id')) {
      claimStatus = false
    } else {
      logError(user.id, draft.document.claimant.payment, `Payment processed successfully but there is problem retrieving claim from claim store externalId: ${draft.document.externalId},`)
      next(err)
      return
    }
  }

  if (claimStatus) {
    await new DraftService().delete(draft.id, user.bearerToken)
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: draft.document.externalId }))
  } else {
    const claim = await ClaimStoreClient.saveClaimForUser(draft, user)
    await new DraftService().delete(draft.id, user.bearerToken)
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPaymentReceiver.uri, async (req, res, next) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    try {
      if (!draft.document.externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
      }
      const amount: number = await claimAmountWithInterest(draft.document)
      if (!amount) {
        throw new Error('No amount entered, you cannot pay yet')
      }

      const paymentRef = draft.document.claimant.payment.reference

      if (paymentRef) {
        const payClient: PayClient = await getPayClient()
        const paymentResponse: PaymentResponse = await payClient.retrieve(user, paymentRef)
        switch (paymentResponse.status) {
          case 'success':
            return res.redirect(Paths.finishPaymentReceiver.evaluateUri({ externalId: draft.document.externalId }))
        }
      }
      const feeOutcome: FeeOutcome = await FeesClient.calculateFee(event, amount, channel)
      const payClient: PayClient = await getPayClient()
      const fees: Fees = new Fees(feeOutcome.amount, feeOutcome.code, feeOutcome.version)
      const feesArray: Fees[] = [fees]
      const payment: Payment = await payClient.create(
        res.locals.user,
        feesArray,
        feeOutcome.amount,
        getReturnURL(req, draft.document.externalId)
      )
      console.log('payment is: ' + JSON.stringify(payment))
      draft.document.claimant.payment = payment
      await new DraftService().save(draft, user.bearerToken)

      res.redirect(payment.links.nextUrl.href)
    } catch (err) {
      logPaymentError(user.id, draft.document.claimant.payment)
      next(err)
    }
  })
  .get(Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    try {
      const { externalId } = req.params

      const paymentId = draft.document.claimant.payment.reference
      if (!paymentId) {
        return res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
      }
      const payClient = await getPayClient()

      const payment: Payment = await payClient.retrieve(user, paymentId)
      draft.document.claimant.payment = new Payment().deserialize(payment)

      await new DraftService().save(draft, user.bearerToken)

      const status: string = payment.status
      console.log('status: ' + status)
      // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
      switch (status) {
        case 'Cancelled':
        case 'Failed':
          logPaymentError(user.id, payment)
          res.redirect(Paths.checkAndSendPage.uri)
          break
        case 'Success':
          await successHandler(res, next)
          break
        default:
          logPaymentError(user.id, payment)
          next(new Error(`Payment failed. Status ${status} is returned by the service`))
      }
    } catch (err) {
      logPaymentError(user.id, draft.document.claimant.payment)
      next(err)
    }
  })
