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
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'
import { FullRejectionGuard } from 'response/guards/fullRejectionGuard'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

const page: RoutablePath = FullRejectionPaths.whyDoYouDisagreePage

function renderView (form: Form<WhyDoYouDisagree>, res: express.Response) {
  res.render(page.associatedView, {
    form: form,
    totalAmount: res.locals.claim.totalAmountTillToday
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FullRejectionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.rejectAllOfClaim.whyDoYouDisagree), res)
    }))
  .post(
    page.uri,
    FullRejectionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    FormValidator.requestHandler(WhyDoYouDisagree, WhyDoYouDisagree.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<WhyDoYouDisagree> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.rejectAllOfClaim.whyDoYouDisagree = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
