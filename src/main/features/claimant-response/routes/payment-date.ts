import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { ModelAccessor as IModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

class ModelAccessor implements IModelAccessor<DraftClaimantResponse, PaymentIntention> {
  get (draft: DraftClaimantResponse): PaymentIntention {
    return draft.alternatePaymentMethod
  }

  set (draft: DraftClaimantResponse, model: PaymentIntention): void {
    draft.alternatePaymentMethod = model
  }

  patch (draft: DraftClaimantResponse, patchOperation: (model: PaymentIntention) => void): void {
    patchOperation(draft.alternatePaymentMethod)
  }
}

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'When do you want the defendant to pay?'
  }

  createModelAccessor (): IModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new ModelAccessor()
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
