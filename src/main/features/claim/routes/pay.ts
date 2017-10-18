import * as express from 'express'
import * as config from 'config'

import { Paths } from 'claim/paths'

import PayClient from 'app/pay/payClient'
import PaymentResponse from 'app/pay/paymentResponse'
import Payment from 'app/pay/payment'

import FeesClient from 'app/fees/feesClient'
import { CalculationOutcome } from 'app/fees/models/calculationOutcome'

import ClaimStoreClient from 'app/claims/claimStoreClient'
import { buildURL } from 'app/utils/callbackBuilder'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
import User from 'app/idam/user'
import { DraftService } from 'services/DraftService'
import { ServiceAuthTokenFactoryImpl } from 'common/security/serviceTokenFactoryImpl'

const logger = require('@hmcts/nodejs-logging').getLogger('router/pay')
const issueFeeCode = config.get<string>('fees.issueFee.code')

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  return new PayClient(authToken)
}

const getReturnURL = (req: express.Request, externalId: string) => {
  return buildURL(req, Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
}

function logPaymentError (id: number, payment: Payment) {
  logError(id, payment, 'Payment might have failed, see payment information: ')
}

function logError (id: number, payment: Payment, message: string) {
  logger.error(`${message} (User Id : ${id}, Payment: ${JSON.stringify(payment)})`)
}

async function successHandler (res, next) {
  const externalId = res.locals.user.claimDraft.document.externalId

  let claimStatus: boolean
  try {
    claimStatus = await ClaimStoreClient.retrieveByExternalId(externalId)
      .then(() => true)
  } catch (err) {
    if (err.toString().includes('Claim not found by external id')) {
      claimStatus = false
    } else {
      logError(res.locals.user.id, res.locals.user.claimDraft.document.claimant.payment, `Payment processed successfully but there is problem retrieving claim from claim store externalId: ${res.locals.user.claimDraft.document.externalId},`)
      next(err)
      return
    }
  }

  if (claimStatus) {
    await new DraftService()['delete'](res.locals.user.claimDraft['id'], res.locals.user.bearerToken)
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
  } else {
    const claim = await ClaimStoreClient.saveClaimForUser(res.locals.user)
    await new DraftService()['delete'](res.locals.user.claimDraft['id'], res.locals.user.bearerToken)
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
  }
}

export default express.Router()
  .get(Paths.startPaymentReceiver.uri, async (req, res, next) => {
    const user: User = res.locals.user
    try {
      if (!user.claimDraft.document.externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
      }
      const amount = claimAmountWithInterest(user.claimDraft.document)
      if (!amount) {
        throw new Error('No amount entered, you cannot pay yet')
      }

      const paymentId = user.claimDraft.document.claimant.payment.id

      if (paymentId) {
        const payClient: PayClient = await getPayClient()
        const payment: Payment = await payClient.retrieve(user, paymentId)
        switch (payment.state.status) {
          case 'success':
            return res.redirect(Paths.finishPaymentReceiver.evaluateUri({ externalId: user.claimDraft.document.externalId }))
        }
      }
      const feeCalculationOutcome: CalculationOutcome = await FeesClient.calculateFee(issueFeeCode, claimAmountWithInterest(res.locals.user.claimDraft.document))
      const payClient: PayClient = await getPayClient()
      const payment: PaymentResponse = await payClient.create(res.locals.user, feeCalculationOutcome.fee.code, feeCalculationOutcome.amount, getReturnURL(req, user.claimDraft.document.externalId))
      res.locals.user.claimDraft.document.claimant.payment = payment

      await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

      res.redirect(payment._links.next_url.href)
    } catch (err) {
      logPaymentError(user.id, user.claimDraft.document.claimant.payment)
      next(err)
    }
  })
  .get(Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    const user: User = res.locals.user
    try {
      const { externalId } = req.params

      const paymentId = user.claimDraft.document.claimant.payment.id
      if (!paymentId) {
        return res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
      }
      const payClient = await getPayClient()

      const payment: Payment = await payClient.retrieve(user, paymentId)
      user.claimDraft.document.claimant.payment = new Payment().deserialize(payment)

      await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

      const status: string = payment.state.status

      // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
      switch (status) {
        case 'cancelled':
        case 'failed':
          logPaymentError(user.id, payment)
          res.redirect(Paths.checkAndSendPage.uri)
          break
        case 'success':
          await successHandler(res, next)
          break
        default:
          logPaymentError(user.id, payment)
          next(new Error(`Payment failed. Status ${status} is returned by the service`))
      }
    } catch (err) {
      logPaymentError(user.id, user.claimDraft.document.claimant.payment)
      next(err)
    }
  })
