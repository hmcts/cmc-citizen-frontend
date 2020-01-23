import * as express from 'express'

import { Paths } from 'paid-in-full/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftPaidInFull } from 'paid-in-full/draft/draftPaidInFull'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DatePaid } from 'paid-in-full/form/models/datePaid'
import { ClaimStoreClient } from 'claims/claimStoreClient'

function renderView (form: Form<DatePaid>, res: express.Response): void {
  res.render(Paths.datePaidPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.datePaidPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftPaidInFull> = res.locals.paidInFullDraft
      renderView(new Form(draft.document.datePaid), res)
    })
  .post(
    Paths.datePaidPage.uri,
    FormValidator.requestHandler(DatePaid, DatePaid.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const form: Form<DatePaid> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftPaidInFull> = res.locals.paidInFullDraft
        const user: User = res.locals.user

        draft.document.datePaid = form.model

        const { externalId } = req.params

        await new ClaimStoreClient().savePaidInFull(externalId, user, draft.document)
        res.redirect(Paths.confirmationPage.uri.replace(':externalId', externalId))
      }
    }))
