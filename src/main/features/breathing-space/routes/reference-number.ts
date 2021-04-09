import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { BreathingSpaceReferenceNumber } from 'features/breathing-space/models/bsReferenceNumber'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'

let breathingSpaceExternalId = null

function renderView (form: Form<BreathingSpaceReferenceNumber>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.referencNumberPage.associatedView, {
    form: form,
    breathingSpaceExternalId: breathingSpaceExternalId
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
.get(Paths.referencNumberPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
  let draft: Draft<DraftClaim> = drafts[drafts.length - 1]
  breathingSpaceExternalId = draft.document.breathingSpace.breathingSpaceExternalId
  renderView(new Form(new BreathingSpaceReferenceNumber(draft.document.breathingSpace.breathingSpaceReferenceNumber)), res, next)
})
.post(
  Paths.referencNumberPage.uri,
  FormValidator.requestHandler(BreathingSpaceReferenceNumber, BreathingSpaceReferenceNumber.fromObject),
  ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<BreathingSpaceReferenceNumber> = req.body

    if (form.hasErrors()) {
      renderView(form, res, next)
    } else {
      const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
      let draft: Draft<DraftClaim> = drafts[drafts.length - 1]
      const user: User = res.locals.user
      draft.document.breathingSpace.breathingSpaceReferenceNumber = form.model.bsNumber
      await new DraftService().save(draft, user.bearerToken)
      res.redirect(Paths.bsStartDatePage.uri)
    }
  }))
