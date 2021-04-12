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
  const { externalId } = req.params
  let bsDraft: Draft<DraftClaim> = res.locals.Draft

  if (bsDraft.document.breathingSpace.breathingSpaceReferenceNumber === undefined &&
    bsDraft.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate === undefined &&
    bsDraft.document.breathingSpace.breathingSpaceType === undefined &&
    bsDraft.document.breathingSpace.breathingSpaceEndDate === undefined) {
    bsDraft.document.breathingSpace.breathingSpaceExternalId = externalId
    await new DraftService().save(bsDraft, res.locals.user.bearerToken)
  }

  breathingSpaceExternalId = externalId
  renderView(new Form(new BreathingSpaceReferenceNumber(bsDraft.document.breathingSpace.breathingSpaceReferenceNumber)), res, next)
})
.post(
  Paths.referencNumberPage.uri,
  FormValidator.requestHandler(BreathingSpaceReferenceNumber, BreathingSpaceReferenceNumber.fromObject),
  ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<BreathingSpaceReferenceNumber> = req.body

    if (form.hasErrors()) {
      renderView(form, res, next)
    } else {
      let draft: Draft<DraftClaim> = res.locals.Draft
      const user: User = res.locals.user
      if (draft.document.breathingSpace !== undefined) {
        draft.document.breathingSpace.breathingSpaceReferenceNumber = form.model.bsNumber
        await new DraftService().save(draft, user.bearerToken)
      }
      res.redirect(Paths.bsStartDatePage.uri)
    }
  }))
