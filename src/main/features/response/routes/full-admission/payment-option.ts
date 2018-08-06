import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { AbstractModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

import { ResponseDraft } from 'response/draft/responseDraft'

import { fullAdmissionPath, Paths } from 'response/paths'

class ModelAccessor extends AbstractModelAccessor<ResponseDraft, PaymentIntention> {
  get (draft: ResponseDraft): PaymentIntention {
    return draft.fullAdmission
  }

  set (draft: ResponseDraft, model: PaymentIntention): void {
    draft.fullAdmission = model
  }
}

class PaymentOptionPage extends AbstractPaymentOptionPage<ResponseDraft> {
  getHeading (): string {
    return ''
  }

  createModelAccessor (): AbstractModelAccessor<ResponseDraft, PaymentIntention> {
    return new ModelAccessor()
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    return Paths.taskListPage.uri
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
