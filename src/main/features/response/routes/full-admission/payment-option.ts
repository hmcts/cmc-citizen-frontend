import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

import { DefendantPaymentOption as PaymentOption } from 'response/form/models/defendantPaymentOption'

import { fullAdmissionPath, Paths } from 'response/paths'

class PaymentOptionPage extends AbstractPaymentOptionPage {
  getModel (res: express.Response): PaymentOption {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    return draft.document.fullAdmission.paymentOption
  }

  saveModel (res: express.Response, model: PaymentOption): void {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    draft.document.fullAdmission.paymentOption = model
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    return Paths.taskListPage.uri
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(fullAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'))
