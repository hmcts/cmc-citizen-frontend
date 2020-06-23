/* tslint:disable:no-default-export */
import * as express from 'express'
import { Paths } from 'claim/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Form } from 'forms/form'
import { HelpWithFees } from 'claim/form/models/helpWithFees'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { YesNoOption } from 'models/yesNoOption'
import { DraftService } from 'services/draftService'

function renderView (form: Form<HelpWithFees>, res: express.Response): void {
  res.render(Paths.helpWithFeesPage.associatedView, { form })
}

export default express.Router()
  .get(Paths.helpWithFeesPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.helpWithFees), res)
  })
  .post(
    Paths.helpWithFeesPage.uri,
    FormValidator.requestHandler(HelpWithFees, HelpWithFees.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<HelpWithFees> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.helpWithFees = form.model

        if (form.model.declared.option === YesNoOption.NO.option) {
          draft.document.helpWithFees.helpWithFeesNumber = undefined
        }

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(Paths.totalPage.uri)
      }
    }))
