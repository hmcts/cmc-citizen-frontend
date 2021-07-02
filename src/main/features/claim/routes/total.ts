import * as express from 'express'
import { Paths } from 'claim/paths'
import { TotalAmount } from 'forms/models/totalAmount'
import { draftClaimAmountWithInterest, draftInterestAmount } from 'shared/interestUtils'
import { FeesClient } from 'fees/feesClient'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { YesNoOption } from 'models/yesNoOption'

import { DraftService } from 'services/draftService'
import { User } from 'idam/user'


/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.totalPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const draft: Draft<DraftClaim> = res.locals.claimDraft

      const interest: number = await draftInterestAmount(draft.document)
      const totalAmount: number = draft.document.amount.totalAmount()
      const claimAmount: number = await draftClaimAmountWithInterest(draft.document)

      const issueFee = await FeesClient.calculateIssueFee(claimAmount)
      const feeCode = await FeesClient.issueFeeCode(claimAmount)

      draft.document.feeCode = feeCode
      await new DraftService().save(draft, user.bearerToken)

      const hearingFee: number = await FeesClient.calculateHearingFee(claimAmount)

      const helpWithFeesFeature: boolean = draft.document.helpWithFees && draft.document.helpWithFees.declared
        && draft.document.helpWithFees.declared.option === YesNoOption.YES.option

      res.render(Paths.totalPage.associatedView,
        {
          interestTotal: new TotalAmount(totalAmount, interest, issueFee),
          interestClaimed: (draft.document.interest.option !== YesNoOption.NO),
          issueFee,
          hearingFee,
          helpWithFeesFeature
        })
    }))
  .post(Paths.totalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.taskListPage.uri)
  })
