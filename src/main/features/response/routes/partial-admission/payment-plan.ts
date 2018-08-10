import * as express from 'express'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
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

class PaymentPlanPage extends AbstractPaymentPlanPage<ResponseDraft> {
  getHeading (): string {
    return 'Your repayment plan'
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
export default new PaymentPlanPage()
  .buildRouter(partialAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
