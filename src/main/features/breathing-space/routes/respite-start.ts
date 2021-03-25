import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { BreathingSpaceRespiteStart } from 'features/breathing-space/models/bsStartDate'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'

function renderView(form: Form<BreathingSpaceRespiteStart>, res: express.Response, next: express.NextFunction) {
    const pastDate: Moment = MomentFactory.currentDate().subtract(1, 'day')
    res.render(Paths.bsStartDatePage.associatedView, {
        form: form,
        pastDate: pastDate
    })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsStartDatePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView(new Form(new BreathingSpaceRespiteStart(res.app.locals.breathingSpaceEnteredDate)), res, next)
    })
    .post(
        Paths.bsStartDatePage.uri,
        FormValidator.requestHandler(BreathingSpaceRespiteStart, BreathingSpaceRespiteStart.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const form: Form<BreathingSpaceRespiteStart> = req.body
            if ((form.model.respiteStart.day || form.model.respiteStart.month || form.model.respiteStart.year) && form.hasErrors()) {
                renderView(form, res, next)
            } else {
                res.app.locals.breathingSpaceEnteredDate = form.model.respiteStart
                res.redirect(Paths.bsTypePage.uri)
            }
        }))
