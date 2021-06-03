import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingSpaceRespiteEnd } from '../models/bsEndDate'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { LocalDate } from 'forms/models/localDate'

function renderView (form: Form<BreathingSpaceRespiteEnd>, res: express.Response, next: express.NextFunction) {
  const currentDate: Moment = MomentFactory.currentDate().add(0, 'days')
  res.render(Paths.bsEndDatePage.associatedView, {
    form: form,
    currentDate: currentDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsEndDatePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let draft: Draft<DraftClaim> = res.locals.Draft
      if (draft.document.breathingSpace.breathingSpaceEndDate) {
        let bsLiftDate: Date = new Date(draft.document.breathingSpace.breathingSpaceEndDate.toLocaleString())
        let bsLiftDateSplit = bsLiftDate.toLocaleDateString().split('/')
        let bsStartDate: LocalDate = new LocalDate(parseInt(bsLiftDateSplit[2], 10),parseInt(bsLiftDateSplit[0], 10), parseInt(bsLiftDateSplit[1], 10))
        renderView(new Form(new BreathingSpaceRespiteEnd(bsStartDate)), res, next)
      } else {
        renderView(new Form(new BreathingSpaceRespiteEnd()), res, next)
      }
    })
    .post(
        Paths.bsEndDatePage.uri,
        FormValidator.requestHandler(BreathingSpaceRespiteEnd, BreathingSpaceRespiteEnd.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const form: Form<BreathingSpaceRespiteEnd> = req.body
          if ((form.model.respiteEnd.day || form.model.respiteEnd.month || form.model.respiteEnd.year) && form.hasErrors()) {
            renderView(form, res, next)
          } else {
            let draft: Draft<DraftClaim> = res.locals.Draft
            const user: User = res.locals.user
            if (draft.document.breathingSpace !== undefined) {
              draft.document.breathingSpace.breathingSpaceEndDate = MomentFactory.parse(form.model.respiteEnd.toMoment().format())
              await new DraftService().save(draft, user.bearerToken)
            }
            res.redirect(Paths.bsCheckAnswersPage.uri)
          }
        }))
