import * as express from 'express'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

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
  .buildRouter(fullAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
