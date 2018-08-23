import * as express from 'express'
import { Paths, StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'main/app/models/yesNoOption'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { PartialAdmissionResponse } from 'main/app/claims/models/response/partialAdmissionResponse'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { getAlreadyPaidAmount, isAlreadyPaidLessThanAmount } from 'claimant-response/helpers/statesPaidHelper'
import { GuardFactory } from 'response/guards/guardFactory'
import { NotFoundError } from 'main/errors'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim
  return isAlreadyPaidLessThanAmount(claim)
}, (req: express.Request): void => {
  throw new NotFoundError(req.path)
})

function renderView (form: Form<PartPaymentReceived>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse
  res.render(StatesPaidPaths.partPaymentReceivedPage.associatedView, { form: form, paidAmount: response.amount })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.partPaymentReceivedPage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.partPaymentReceived), res)
    }))
  .post(
    StatesPaidPaths.partPaymentReceivedPage.uri,
    stateGuardRequestHandler,
    FormValidator.requestHandler(PartPaymentReceived, PartPaymentReceived.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<PartPaymentReceived> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const claim: Claim = res.locals.claim

        draft.document.partPaymentReceived = form.model

        if (form.model.received.option === YesNoOption.NO.option) {
          draft.document.accepted = undefined
        }

        if (draft.document.paidAmount === undefined) {
          draft.document.paidAmount = new PaidAmount(new PaidAmountOption(YesNoOption.YES.option),
            getAlreadyPaidAmount(claim),
            claim.totalAmountTillDateOfIssue)
        }

        await new DraftService().save(draft, res.locals.user.bearerToken)

        if (form.model.received.option === YesNoOption.NO.option) {
          res.redirect(Paths.rejectionReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    })
  )
