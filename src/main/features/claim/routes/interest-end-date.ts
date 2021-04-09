import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestEndDate } from 'claim/form/models/interestEndDate'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

function renderView (form: Form<InterestEndDate>, res: express.Response): void {
  res.render(Paths.interestEndDatePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestEndDatePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestEndDate), res)
  })
  .post(
    Paths.interestEndDatePage.uri,
    FormValidator.requestHandler(InterestEndDate, InterestEndDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestEndDate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestEndDate = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (await featureToggles.isHelpWithFeesEnabled()) {
          res.redirect(Paths.helpWithFeesPage.uri)
        } else {
          res.redirect(Paths.totalPage.uri)
        }
      }
    }))
