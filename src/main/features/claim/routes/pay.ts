import * as express from 'express'
import * as config from 'config'
import PayClient from 'app/pay/payClient'
import PaymentResponse from 'app/pay/paymentResponse'
import { Paths } from 'claim/paths'
import IdamClient from 'idam/idamClient'
import FeesClient from 'app/fees/feesClient'
import Payment from 'app/pay/payment'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import { buildURL } from 'app/utils/CallbackBuilder'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { RangeFee } from 'app/fees/rangeFee'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
const logger = require('@hmcts/nodejs-logging').getLogger('router/pay')
const issueFeeCode = config.get<string>('fees.issueFeeCode')

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await IdamClient.retrieveServiceToken()

  return new PayClient(authToken)
}

const getReturnURL = (req: express.Request) => {
  return buildURL(req, Paths.finishPaymentReceiver.uri, true)
}

function logPaymentError (id: number, payment: Payment) {
  logError(id, payment, 'Payment might have failed, see payment information: ')
}

function logError (id: number, payment: Payment, message: string) {
  logger.error(`${message} (User Id : ${id}, Payment: ${JSON.stringify(payment)})`)
}

async function successHandler (res, next) {
  const externalId = res.locals.user.claimDraft.externalId

  let claimStatus: boolean
  try {
    claimStatus = await ClaimStoreClient.retrieveByExternalId(externalId)
      .then(() => true)
  } catch (err) {
    if (err.toString().includes('Claim not found by external id')) {
      claimStatus = false
    } else {
      logError(res.locals.user.id, res.locals.user.claimDraft.claimant.payment, `Payment processed successfully but there is problem retrieving claim from claim store externalId: ${res.locals.user.claimDraft.externalId},`)
      next(err)
      return
    }
  }
  if (claimStatus) {
    await ClaimDraftMiddleware.delete(res, next)
    res.redirect(Paths.confirmationPage.uri.replace(':externalId', externalId))
  } else {
    const claim = await ClaimStoreClient.saveClaimForUser(res.locals.user)
    await ClaimDraftMiddleware.delete(res, next)
    res.redirect(Paths.confirmationPage.uri.replace(':externalId', claim.externalId))
  }
}

export default express.Router()
  .get(Paths.startPaymentReceiver.uri, async (req, res, next) => {
    try {
      if (!res.locals.user.claimDraft.externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${res.locals.user.id}`)
      }
      const issueFee: RangeFee = await FeesClient.callFeesRegister(issueFeeCode, claimAmountWithInterest(res.locals.user.claimDraft))
      const payClient: PayClient = await getPayClient()
      const payment: PaymentResponse = await payClient.create(res.locals.user, issueFee, getReturnURL(req))
      res.locals.user.claimDraft.claimant.payment = payment

      await ClaimDraftMiddleware.save(res, next)
      res.redirect(payment._links.next_url.href)
    } catch (err) {
      logPaymentError(res.locals.user.id, res.locals.user.claimDraft.claimant.payment)
      next(err)
    }
  })
  .get(Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    try {
      const payClient = await getPayClient()

      const paymentId = res.locals.user.claimDraft.claimant.payment.id

      const payment: Payment = await payClient.retrieve(res.locals.user, paymentId)
      res.locals.user.claimDraft.claimant.payment = new Payment().deserialize(payment)

      await ClaimDraftMiddleware.save(res, next)
      const status: string = payment.state.status

      // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
      switch (status) {
        case 'cancelled':
        case 'failed':
          logPaymentError(res.locals.user.id, payment)
          res.redirect(Paths.checkAndSendPage.uri)
          break
        case 'success':
          await successHandler(res, next)
          break
        default:
          logPaymentError(res.locals.user.id, payment)
          next(new Error(`Payment failed. Status ${status} is returned by the service`))
      }
    } catch (err) {
      logPaymentError(res.locals.user.id, res.locals.user.claimDraft.claimant.payment)
      next(err)
    }
  })
