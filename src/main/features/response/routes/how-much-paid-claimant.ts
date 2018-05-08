import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { HowMuchPaidClaimant, HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResponseType } from 'response/form/models/responseType'

function isRequestAllowed (res: express.Response): boolean {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.response !== undefined
    && draft.document.response.type === ResponseType.DEFENCE
    && draft.document.rejectAllOfClaim !== undefined && draft.document.rejectAllOfClaim.option === RejectAllOfClaimOption.ALREADY_PAID
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
}

const guardRequestHandler: express.RequestHandler = GuardFactory.create(isRequestAllowed, accessDeniedCallback)

async function renderView (form: Form<HowMuchPaidClaimant>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.defendantHowMuchPaidClaimant.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantHowMuchPaidClaimant.uri,
    guardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.howMuchPaidClaimant), res, next)
    }))
  .post(
    Paths.defendantHowMuchPaidClaimant.uri,
    guardRequestHandler,
    FormValidator.requestHandler(HowMuchPaidClaimant),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<HowMuchPaidClaimant> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.howMuchPaidClaimant = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params

        if (draft.document.howMuchPaidClaimant.option === HowMuchPaidClaimantOption.LESS_THAN_AMOUNT_CLAIMED) {
          res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
