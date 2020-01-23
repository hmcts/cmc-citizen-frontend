import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

import { ResponseDraft } from 'response/draft/responseDraft'

import { partialAdmissionPath, Paths } from 'response/paths'

class ModelAccessor extends AbstractModelAccessor<ResponseDraft, PaymentIntention> {
  get (draft: ResponseDraft): PaymentIntention {
    return draft.partialAdmission.paymentIntention
  }

  set (draft: ResponseDraft, model: PaymentIntention): void {
    draft.partialAdmission.paymentIntention = model
  }
}

class PaymentDatePage extends AbstractPaymentDatePage<ResponseDraft> {
  getHeading (): string {
    return 'What date will you pay on?'
  }

  createModelAccessor (): AbstractModelAccessor<ResponseDraft, PaymentIntention> {
    return new ModelAccessor()
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(partialAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
