import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'

function calculateInterest (amount: number, noOfDays: number) {
  const rate = 8.0
  return parseFloat(((amount * noOfDays * rate) / (365 * 100) ).toFixed(2))
}

export default express.Router()
  .get(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)
      const amount: number = claim.claimData.amount
      let noOfDays: number = 0
      let interest: number = 0

      if (claim.claimData.interestDate.date) {
        noOfDays = MomentFactory.currentDateTime().diff(claim.claimData.interestDate.date, 'days')
        interest = calculateInterest(amount, noOfDays)
      }

      res.render(
        Paths.paidAmountSummaryPage.associatedView,
        { claim: claim, numberOfDays: noOfDays, interest: interest }
      )
    }))
  .post(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        res.redirect('todo')
      }))
