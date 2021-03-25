import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { BreathingSpaceReferenceNumber } from 'features/breathing-space/models/bsReferenceNumber'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'
import { DraftService } from 'services/draftService'

const bsDraft = new Draft<BreathingSpace>(null,null,null,null,null)

function renderView (form: Form<BreathingSpaceReferenceNumber>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.referencNumberPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
.get(Paths.referencNumberPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(new BreathingSpaceReferenceNumber(res.app.locals.breathingSpaceReferenceNumber)), res, next)
})
.post(
  Paths.referencNumberPage.uri,
  FormValidator.requestHandler(BreathingSpaceReferenceNumber, BreathingSpaceReferenceNumber.fromObject),
  ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<BreathingSpaceReferenceNumber> = req.body

    if (form.hasErrors()) {
      renderView(form, res, next)
    } else {
      res.app.locals.breathingSpaceReferenceNumber = form.model.bsNumber

      res.redirect(Paths.bsStartDatePage.uri)
    }
  }))
