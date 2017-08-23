import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { PartyDetails } from 'app/forms/models/partyDetails'
import { Form } from 'app/forms/form'

function renderView (form: Form<PartyDetails>, res: express.Response): void {
  res.render(Paths.claimAmountPage.associatedView, { form: form, claim: res.locals.user.claim })
}

export default express.Router()
  .get(Paths.claimAmountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(new Form(null), res)
    }))

  .post(Paths.claimAmountPage.uri,
    // FormValidator.requestHandler(PartyDetails, PartyDetails.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        // const form: Form<PartyDetails> = req.body
        // const user: User = res.locals.user
        //
        // if (form.hasErrors()) {
        //   renderView(form, res)
        // } else {
        //   user.ccjDraft.defendant.partyDetails = form.model
        //   await DraftCCJService.save(res, next)
        //   res.redirect('todo')
        // }
        renderView(new Form(null), res)
      }))
