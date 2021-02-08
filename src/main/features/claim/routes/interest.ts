import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { Interest } from 'claim/form/models/interest'
import { YesNoOption } from 'models/yesNoOption'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

function renderView (form: Form<Interest>, res: express.Response): void {
  res.render(Paths.interestPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interest), res)
  })
  .post(
    Paths.interestPage.uri,
    FormValidator.requestHandler(Interest, Interest.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Interest> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        if (form.model.option === YesNoOption.NO) {
          draft.document.interestTotal = undefined
          draft.document.interestContinueClaiming = undefined
          draft.document.interestHowMuch = undefined
          draft.document.interestRate = undefined
          draft.document.interestDate = undefined
          draft.document.interestStartDate = undefined
          draft.document.interestEndDate = undefined
          draft.document.interestType = undefined
        }

        draft.document.interest = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option === YesNoOption.NO) {
          if (await featureToggles.isHelpWithFeesEnabled()) {
            res.redirect(Paths.helpWithFeesPage.uri)
          } else {
            res.redirect(Paths.totalPage.uri)
          }
        } else {
          res.redirect(Paths.interestTypePage.uri)
        }
      }
    }))
