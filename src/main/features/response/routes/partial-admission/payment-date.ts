import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { ModelAccessor as IModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

import { ResponseDraft } from 'response/draft/responseDraft'

import { partialAdmissionPath, Paths } from 'response/paths'

class ModelAccessor implements IModelAccessor<ResponseDraft, PaymentIntention> {
  get (draft: ResponseDraft): PaymentIntention {
    return draft.partialAdmission
  }

  set (draft: ResponseDraft, model: PaymentIntention): void {
    draft.partialAdmission = model
  }

  patch (draft: ResponseDraft, patchOperation: (model: PaymentIntention) => void): void {
    patchOperation(draft.partialAdmission)
  }
}

class PaymentDatePage extends AbstractPaymentDatePage<ResponseDraft> {
  getHeading (): string {
    return 'What date will you pay on?'
  }

  createModelAccessor (): IModelAccessor<ResponseDraft, PaymentIntention> {
    return new ModelAccessor()
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
