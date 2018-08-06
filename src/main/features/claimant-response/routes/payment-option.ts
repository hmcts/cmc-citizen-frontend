import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { PaymentIntention } from 'shared/components/payment-intention/model'

import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import {
  DefendantPaymentOption as PaymentOption
} from 'response/form/models/defendantPaymentOption'

import { claimantResponsePath } from 'claimant-response/paths'

class PaymentOptionPage extends AbstractPaymentOptionPage {
  getModel (res: express.Response): PaymentOption {
    const draft: Draft<DraftClaimantResponse> = res.locals.draft
    return draft.document.alternatePaymentMethod ? draft.document.alternatePaymentMethod.paymentOption : undefined
  }

  saveModel (res: express.Response, model: PaymentOption): void {
    const draft: Draft<DraftClaimantResponse> = res.locals.draft

    if (!draft.document.alternatePaymentMethod) {
      draft.document.alternatePaymentMethod = new PaymentIntention()
    }
    draft.document.alternatePaymentMethod.paymentOption = model
  }

  getView (): string {
    return 'claimant-response/views/payment-option'
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(claimantResponsePath)
