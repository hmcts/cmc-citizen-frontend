import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

import { ResponseDraft } from 'response/draft/responseDraft'

import { fullAdmissionPath, Paths } from 'response/paths'

class ModelAccessor extends AbstractModelAccessor<ResponseDraft, PaymentIntention> {
  get (draft: ResponseDraft): PaymentIntention {
    return draft.fullAdmission.paymentIntention
  }

  set (draft: ResponseDraft, model: PaymentIntention): void {
    draft.fullAdmission.paymentIntention = model
  }
}

class PaymentDatePage extends AbstractPaymentDatePage<ResponseDraft> {
  getHeading (): string {
    return 'What date will you pay on?'
  }

  createModelAccessor (): AbstractModelAccessor<ResponseDraft, PaymentIntention> {
    return new ModelAccessor()
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
