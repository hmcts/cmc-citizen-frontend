import * as express from 'express'
import { ccjPath, Paths } from 'ccj/paths'

import { AbstractPaidAmountPage } from 'shared/components/ccj/routes/paid-amount'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'

class PaidAmountPage extends AbstractPaidAmountPage<DraftCCJ> {

  getView (): string {
    return 'components/ccj/views/paid-amount'
  }

  getHeading (): string {
    return ''
  }

  createModelAccessor (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(ccjPath)
