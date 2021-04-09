import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { InterestDate } from 'claim/form/models/interestDate'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestDateType } from 'common/interestDateType'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

function renderView (form: Form<InterestDate>, res: express.Response): void {
  res.render(Paths.interestDatePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestDatePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestDate), res)
  })
  .post(
    Paths.interestDatePage.uri,
    FormValidator.requestHandler(InterestDate, InterestDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestDate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestDate = form.model
        if (form.model.type === InterestDateType.SUBMISSION) {
          draft.document.interestStartDate = undefined
          draft.document.interestEndDate = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.type === InterestDateType.SUBMISSION) {
          if (await featureToggles.isHelpWithFeesEnabled()) {
            res.redirect(Paths.helpWithFeesPage.uri)
          } else {
            res.redirect(Paths.totalPage.uri)
          }
        } else {
          res.redirect(Paths.interestStartDatePage.uri)
        }

      }
    }))
