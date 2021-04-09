import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { BreathingSpaceRespiteStart } from 'features/breathing-space/models/bsStartDate'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { LocalDate } from 'forms/models/localDate'

function renderView (form: Form<BreathingSpaceRespiteStart>, res: express.Response, next: express.NextFunction) {
  const pastDate: Moment = MomentFactory.currentDate().subtract(1, 'day')
  res.render(Paths.bsStartDatePage.associatedView, {
    form: form,
    pastDate: pastDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsStartDatePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
      let draft: Draft<DraftClaim> = drafts[drafts.length - 1]
      if (draft.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate) {
        let bsLiftDate: Date = new Date(draft.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate.toLocaleString())
        let bsLiftDateSplit = bsLiftDate.toLocaleDateString().split('/')
        let bsStartDate: LocalDate = new LocalDate(parseInt(bsLiftDateSplit[2], 10),parseInt(bsLiftDateSplit[0], 10), parseInt(bsLiftDateSplit[1], 10))
        renderView(new Form(new BreathingSpaceRespiteStart(bsStartDate)), res, next)
      } else {
        renderView(new Form(new BreathingSpaceRespiteStart()), res, next)
      }
    })
    .post(
        Paths.bsStartDatePage.uri,
        FormValidator.requestHandler(BreathingSpaceRespiteStart, BreathingSpaceRespiteStart.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const form: Form<BreathingSpaceRespiteStart> = req.body
          if ((form.model.respiteStart.day || form.model.respiteStart.month || form.model.respiteStart.year) && form.hasErrors()) {
            renderView(form, res, next)
          } else {
            const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
            let draft: Draft<DraftClaim> = drafts[drafts.length - 1]
            const user: User = res.locals.user
            draft.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate = MomentFactory.parse(form.model.respiteStart.toMoment().format())
            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.bsTypePage.uri)
          }
        }))
