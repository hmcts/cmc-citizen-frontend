import * as express from 'express'
import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestHowMuch } from 'claim/form/models/interestHowMuch'
import { InterestRateOption } from 'claim/form/models/interestRateOption'

import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

function renderView (form: Form<InterestHowMuch>, res: express.Response): void {
  res.render(Paths.interestHowMuchPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestHowMuchPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestHowMuch), res)
  })
  .post(
    Paths.interestHowMuchPage.uri,
    FormValidator.requestHandler(InterestHowMuch, InterestHowMuch.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<InterestHowMuch> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        if (form.model.type === InterestRateOption.STANDARD) {
          draft.document.interestHowMuch.dailyAmount = undefined
        }

        draft.document.interestHowMuch = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (await featureToggles.isHelpWithFeesEnabled()) {
          res.redirect(Paths.helpWithFeesPage.uri)
        } else {
          res.redirect(Paths.totalPage.uri)
        }
      }
    }))
