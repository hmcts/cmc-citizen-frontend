import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingSpaceLiftDate } from '../models/bsLiftDate'

function renderView (form: Form<BreathingSpaceLiftDate>, res: express.Response, next: express.NextFunction) {
  const currentDate: Moment = MomentFactory.currentDate().add(0, 'days')
  res.render(Paths.bsLiftPage.associatedView, {
    form: form,
    currentDate: currentDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsLiftPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(new BreathingSpaceLiftDate(res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate)), res, next)
    })
    .post(
        Paths.bsLiftPage.uri,
        FormValidator.requestHandler(BreathingSpaceLiftDate, BreathingSpaceLiftDate.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const form: Form<BreathingSpaceLiftDate> = req.body
          if ((form.model.respiteLiftDate.day || form.model.respiteLiftDate.month || form.model.respiteLiftDate.year) && form.hasErrors()) {
            renderView(form, res, next)
          } else {
            res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate = form.model.respiteLiftDate
            res.redirect(Paths.bsLiftCheckAnswersPage.uri)
          }
        }))
