import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { BreathingSpaceReferenceNumber } from 'features/breathing-space/models/bsReferenceNumber'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { prepareClaimDraft } from 'drafts/draft-data/claimDraft'

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

  const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)

  let bsDraft: Draft<DraftClaim> = res.locals.bsDraft
  if (drafts.length > 1) {
    drafts.forEach(async bsDraftsTemp => {
      await new DraftService().delete(bsDraftsTemp.id, res.locals.user.bearerToken)
    })
  } else if (drafts.length === 0) {
    bsDraft.document = new DraftClaim().deserialize(prepareClaimDraft(res.locals.user.email, false))
    bsDraft.document.breathingSpace.breathingSpaceExternalId = externalId

    await new DraftService().save(bsDraft, res.locals.user.bearerToken)
  }

  const bsDrafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
  let draft: Draft<DraftClaim> = bsDrafts[bsDrafts.length - 1]
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
