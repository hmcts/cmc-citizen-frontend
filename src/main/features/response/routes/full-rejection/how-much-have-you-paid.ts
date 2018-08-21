/* tslint:disable:no-default-export */
import * as express from 'express'

import { FullRejectionPaths, Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { RoutablePath } from 'shared/router/routablePath'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { FullRejectionGuard } from 'response/guards/fullRejectionGuard'
import { Claim } from 'claims/models/claim'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

const page: RoutablePath = FullRejectionPaths.howMuchHaveYouPaidPage

function renderView (form: Form<HowMuchHaveYouPaid>, res: express.Response) {
  res.render(page.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(
    page.uri,
    FullRejectionGuard.requestHandler(),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.rejectAllOfClaim.howMuchHaveYouPaid), res)
    }))
  .post(
    page.uri,
    FormValidator.requestHandler(HowMuchHaveYouPaid, HowMuchHaveYouPaid.fromObject),
    FullRejectionGuard.requestHandler(),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<HowMuchHaveYouPaid> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.rejectAllOfClaim.howMuchHaveYouPaid = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params

        const paidLessThanClaimed = form.model.amount < claim.totalAmountTillToday
        const paidEqualToClaimed = form.model.amount === claim.totalAmountTillToday
        const admissionsEnabled = ClaimFeatureToggles.areAdmissionsEnabled(claim)

        /*
          redirection matrix:
              admissions            !admissions
           <  youHavePaidLessPage   sendYourResponseByEmailPage
           =  taskListPage          taskListPage
           >  taskListPage          sendYourResponseByEmailPage
         */

        if (paidLessThanClaimed) {
          if (admissionsEnabled) {
            res.redirect(FullRejectionPaths.youHavePaidLessPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
          }
        } else if (paidEqualToClaimed) {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        } else if (admissionsEnabled) {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
