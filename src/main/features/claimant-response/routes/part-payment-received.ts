import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'main/app/models/yesNoOption'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { GuardFactory } from 'response/guards/guardFactory'
import { NotFoundError } from 'main/errors'
import { Logger } from '@hmcts/nodejs-logging'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim
  return StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)
}, (req: express.Request): void => {
  const logger = Logger.getLogger('claimant-response/guards/stateGuardRequestHandler')
  logger.warn('State guard: claimant response already exists - redirecting to dashboard')
  throw new NotFoundError(req.path)
})

function renderView (form: Form<PartPaymentReceived>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  res.render(Paths.partPaymentReceivedPage.associatedView, {
    form: form,
    paidAmount: StatesPaidHelper.getAlreadyPaidAmount(claim)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.partPaymentReceivedPage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.partPaymentReceived), res)
    }))
  .post(
    Paths.partPaymentReceivedPage.uri,
    stateGuardRequestHandler,
    FormValidator.requestHandler(PartPaymentReceived, PartPaymentReceived.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<PartPaymentReceived> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

        draft.document.partPaymentReceived = form.model

        if (form.model.received.option === YesNoOption.NO.option) {
          draft.document.accepted = undefined
          draft.document.rejectionReason = undefined
        }

        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
