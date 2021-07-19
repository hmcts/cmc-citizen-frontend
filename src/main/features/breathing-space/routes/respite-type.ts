import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingType } from '../models/bsType'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<BreathingType>, res: express.Response, next: express.NextFunction) {
  const pastDate: Moment = MomentFactory.currentDate().subtract(1, 'day')
  res.render(Paths.bsTypePage.associatedView, {
    form: form,
    pastDate: pastDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsTypePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let draft: Draft<DraftClaim> = res.locals.Draft
      renderView(new Form(new BreathingType(draft.document.breathingSpace.breathingSpaceType)), res, next)
    })
    .post(
        Paths.bsTypePage.uri,
        FormValidator.requestHandler(BreathingType, BreathingType.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const form: Form<BreathingType> = req.body

          if (form.hasErrors()) {
            renderView(form, res, next)
          } else {
            let draft: Draft<DraftClaim> = res.locals.Draft
            const user: User = res.locals.user
            draft.document.breathingSpace.breathingSpaceType = form.model.option
            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.bsEndDatePage.uri)
          }
        }))
