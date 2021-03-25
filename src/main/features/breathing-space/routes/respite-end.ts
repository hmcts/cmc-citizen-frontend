import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingSpaceRespiteEnd } from '../models/bsEndDate'

function renderView(form: Form<BreathingSpaceRespiteEnd>, res: express.Response, next: express.NextFunction) {
    const currentDate: Moment = MomentFactory.currentDate().add(0, 'days')
    res.render(Paths.bsEndDatePage.associatedView, {
        form: form,
        currentDate: currentDate
    })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsEndDatePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView(new Form(new BreathingSpaceRespiteEnd(res.app.locals.breathingSpaceEndDate)), res, next)
    })
    .post(
        Paths.bsEndDatePage.uri,
        FormValidator.requestHandler(BreathingSpaceRespiteEnd, BreathingSpaceRespiteEnd.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const form: Form<BreathingSpaceRespiteEnd> = req.body
            if ((form.model.respiteEnd.day && form.model.respiteEnd.month && form.model.respiteEnd.year) && form.hasErrors()) {
                renderView(form, res, next)
            } else {
                res.app.locals.breathingSpaceEndDate = form.model.respiteEnd
                res.redirect(Paths.bsCheckAnswersPage.uri)
            }
        }))
