import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

class PaymentOptionPage extends AbstractPaymentOptionPage<DraftClaimantResponse> {

  getView (): string {
    return 'claimant-response/views/payment-option'
  }

  getHeading (): string {
    return ''
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod', () => new PaymentIntention())
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    return Paths.taskListPage.uri
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(claimantResponsePath)
