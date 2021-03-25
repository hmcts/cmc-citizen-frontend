import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { BreathingType } from '../models/bsType'

function renderView(form: Form<BreathingType>, res: express.Response, next: express.NextFunction) {
    const pastDate: Moment = MomentFactory.currentDate().subtract(1, 'day')
    res.render(Paths.bsTypePage.associatedView, {
        form: form,
        pastDate: pastDate
    })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsTypePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView(new Form(new BreathingType(res.app.locals.breathingSpaceType)), res, next)
    })
    .post(
        Paths.bsTypePage.uri,
        FormValidator.requestHandler(BreathingType, BreathingType.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const form: Form<BreathingType> = req.body

            if (form.hasErrors()) {
                renderView(form, res, next)
            } else {
                
                res.app.locals.breathingSpaceType = form.model.option
                res.redirect(Paths.bsEndDatePage.uri)
            }
        }))
