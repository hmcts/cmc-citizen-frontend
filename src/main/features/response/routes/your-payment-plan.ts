import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const user: User = res.locals.user
  const alreadyPaid: number = user.responseDraft.document.paidAmount.amount || 0

  res.render(Paths.defencePaymentPlanPage.associatedView, {
    form: form,
    remainingAmount: user.claim.totalAmountTillToday - alreadyPaid
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      renderView(new Form(user.responseDraft.document.defendantPaymentPlan), res)
    }))

  .post(Paths.defencePaymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(DefendantPaymentPlan, DefendantPaymentPlan.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<DefendantPaymentPlan> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          user.responseDraft.document.defendantPaymentPlan = form.model
          await new DraftService().save(user.responseDraft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }))
