import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

import { DefendantPaymentOption as PaymentOption } from 'response/form/models/defendantPaymentOption'

import { partialAdmissionPath, Paths } from 'response/paths'

class PaymentOptionPage extends AbstractPaymentOptionPage {
  getModel (res: express.Response): PaymentOption {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    return draft.document.partialAdmission.paymentOption
  }

  saveModel (res: express.Response, model: PaymentOption): void {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    draft.document.partialAdmission.paymentOption = model
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    return Paths.taskListPage.uri
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
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'), setHowMuchDoYouOweAmount)
