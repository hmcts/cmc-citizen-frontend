import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

import { ResponseDraft } from 'response/draft/responseDraft'
import {
  PaymentOption,
  PaymentType
} from 'shared/components/payment-intention/model/paymentOption'

import { partialAdmissionPath, Paths } from 'response/paths'

class ModelAccessor extends AbstractModelAccessor<ResponseDraft, PaymentIntention> {
  get (draft: ResponseDraft): PaymentIntention {
    return draft.partialAdmission.paymentIntention ? draft.partialAdmission.paymentIntention : new PaymentIntention()
  }

  set (draft: ResponseDraft, model: PaymentIntention): void {
    draft.partialAdmission.paymentIntention = model
  }
}

class PaymentOptionPage extends AbstractPaymentOptionPage<ResponseDraft> {

  createModelAccessor (): AbstractModelAccessor<ResponseDraft, PaymentIntention> {
    return new ModelAccessor()
  }

  buildPostSubmissionUri (path: string, req: express.Request, res: express.Response): string {
    const model: PaymentOption = req.body.model

    if (model.isOfType(PaymentType.INSTALMENTS)) {
      return this.buildTaskListUri(req, res)
    }

    return super.buildPostSubmissionUri(path, req, res)
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

const setHowMuchDoYouOweAmount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const draft: ResponseDraft = res.locals.responseDraft.document

  if (draft.isResponsePartiallyAdmitted() && draft.partialAdmission.howMuchDoYouOwe) {
    res.locals.amount = draft.partialAdmission.howMuchDoYouOwe.amount || 0
  }

  next()
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(partialAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'), setHowMuchDoYouOweAmount)
