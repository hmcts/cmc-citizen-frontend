import { ccjPath } from 'ccj/paths'

import { AbstractPaidAmountPage } from 'shared/components/ccj/routes/paid-amount'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'

class PaidAmountPage extends AbstractPaidAmountPage<DraftCCJ> {

  getHeading (): string {
    return ''
  }

  createModelAccessor (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(ccjPath)
