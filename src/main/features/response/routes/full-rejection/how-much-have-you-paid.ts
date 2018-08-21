/* tslint:disable:no-default-export */
import * as express from 'express'

import { FullRejectionPaths, Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Logger } from '@hmcts/nodejs-logging'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { RoutablePath } from 'shared/router/routablePath'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { FeatureToggles } from 'utils/featureToggles'
import { Claim } from 'claims/models/claim'

const page: RoutablePath = FullRejectionPaths.howMuchHaveYouPaidPage

function renderView (form: Form<HowMuchHaveYouPaid>, res: express.Response) {
  res.render(page.associatedView, {
    form: form,
    totalAmount: res.locals.claim.totalAmountTillToday
  })
}

const responseRejectedGuardHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  if (draft.document.isResponseRejected()) {
    next()
  } else {
    const claim: Claim = res.locals.claim
    Logger.getLogger('response/guards/responseGuard').warn('Full Rejection Guard: user tried to access page for full rejection flow')
    res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: claim.externalId }))
  }
}

export default express.Router()
  .get(
    page.uri,
    responseRejectedGuardHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.rejectAllOfClaim.howMuchHaveYouPaid), res)
    }))
  .post(
    page.uri,
    FormValidator.requestHandler(HowMuchHaveYouPaid, HowMuchHaveYouPaid.fromObject),
    responseRejectedGuardHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<HowMuchHaveYouPaid> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.rejectAllOfClaim.howMuchHaveYouPaid = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.amount < res.locals.claim.totalAmountTillToday) {
          if (FeatureToggles.hasAnyAuthorisedFeature(res.locals.claim.features, 'admissions')) {
            res.redirect(FullRejectionPaths.youHavePaidLessPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
          }
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
