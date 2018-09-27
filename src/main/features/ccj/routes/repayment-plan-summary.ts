import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { RepaymentPlan } from 'claims/models/repaymentPlan'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const repaymentPlan: RepaymentPlan = claim.countyCourtJudgment.repaymentPlan
  console.log(repaymentPlan)

  res.render(Paths.repaymentPlanSummaryPage.associatedView, {
    form: form,
    claim: claim,
    repaymentPlan: repaymentPlan
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), res)
    }))
