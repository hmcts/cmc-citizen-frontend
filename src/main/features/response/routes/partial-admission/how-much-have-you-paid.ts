import * as express from 'express'

import { PartAdmissionPaths, Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { RoutablePath } from 'shared/router/routablePath'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { PartialAdmissionGuard } from 'response/guards/partialAdmissionGuard'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

const page: RoutablePath = PartAdmissionPaths.howMuchHaveYouPaidPage

function renderView (form: Form<HowMuchHaveYouPaid>, res: express.Response) {
  const pastDate: Moment = MomentFactory.currentDate().subtract(3, 'months')

  res.render(page.associatedView, {
    form: form,
    totalAmount: res.locals.claim.totalAmountTillToday,
    pastDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.partialAdmission.howMuchHaveYouPaid), res)
    }))
  .post(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    FormValidator.requestHandler(HowMuchHaveYouPaid, HowMuchHaveYouPaid.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<HowMuchHaveYouPaid> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.partialAdmission.howMuchHaveYouPaid = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
