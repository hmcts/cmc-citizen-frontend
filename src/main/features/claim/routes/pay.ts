import * as express from 'express'
import * as config from 'config'

import { Paths } from 'claim/paths'

import IdamClient from 'idam/idamClient'

import PayClient from 'app/pay/payClient'
import PaymentResponse from 'app/pay/paymentResponse'
import Payment from 'app/pay/payment'

import FeesClient from 'app/fees/feesClient'
import { CalculationOutcome } from 'app/fees/models/calculationOutcome'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import { PartyType } from 'app/common/partyType'
import { buildURL } from 'app/utils/CallbackBuilder'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
import User from 'app/idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('router/pay')
const issueFeeCode = config.get<string>('fees.issueFee.code')

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await IdamClient.retrieveServiceToken()

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
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
  } else {
    const claim = await ClaimStoreClient.saveClaimForUser(res.locals.user)
    await ClaimDraftMiddleware.delete(res, next)
    res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
  }
}

export default express.Router()
  .get(Paths.startPaymentReceiver.uri, async (req, res, next) => {
    const user: User = res.locals.user
    try {
      if (!user.claimDraft.externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
      }
      const amount = claimAmountWithInterest(user.claimDraft)
      if (!amount) {
        throw new Error('No amount entered, you cannot pay yet')
      }

      const paymentId = user.claimDraft.claimant.payment.id

      if (paymentId) {
        const payClient: PayClient = await getPayClient()
        const payment: Payment = await payClient.retrieve(user, paymentId)
        switch (payment.state.status) {
          case 'success':
            return res.redirect(Paths.finishPaymentReceiver.evaluateUri({ externalId: user.claimDraft.externalId }))
        }
      }
      const feeCalculationOutcome: CalculationOutcome = await FeesClient.calculateFee(issueFeeCode, claimAmountWithInterest(res.locals.user.claimDraft))
      const payClient: PayClient = await getPayClient()
      const payment: PaymentResponse = await payClient.create(res.locals.user, feeCalculationOutcome.fee.code, feeCalculationOutcome.amount, getReturnURL(req, user.claimDraft.externalId))
      res.locals.user.claimDraft.claimant.payment = payment
      await ClaimDraftMiddleware.save(res, next)
      res.redirect(payment._links.next_url.href)
    } catch (err) {
      logPaymentError(user.id, user.claimDraft.claimant.payment)
      next(err)
    }
  })
  .get(Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    const user: User = res.locals.user
    try {
      const { externalId } = req.params

      const paymentId = user.claimDraft.claimant.payment.id
      if (!paymentId) {
        return res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
      }
      const payClient = await getPayClient()

      const payment: Payment = await payClient.retrieve(user, paymentId)
      user.claimDraft.claimant.payment = new Payment().deserialize(payment)

      await ClaimDraftMiddleware.save(res, next)
      const status: string = payment.state.status

      // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
      switch (status) {
        case 'cancelled':
        case 'failed':
          logPaymentError(user.id, payment)
          if (user.claim.claimData.claimant.type === PartyType.COMPANY.value || user.claim.claimData.claimant.type === PartyType.ORGANISATION.value) {
            res.redirect(Paths.checkAndSendCompanyPage.uri)
          } else {
            res.redirect(Paths.checkAndSendPage.uri)
          }
          break
        case 'success':
          await successHandler(res, next)
          break
        default:
          logPaymentError(user.id, payment)
          next(new Error(`Payment failed. Status ${status} is returned by the service`))
      }
    } catch (err) {
      logPaymentError(user.id, user.claimDraft.claimant.payment)
      next(err)
    }
  })
