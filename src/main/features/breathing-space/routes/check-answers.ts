import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'
import moment = require('moment')
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { DraftClaim } from 'drafts/models/draftClaim'


function renderView (form: Form<BreathingSpace>, res: express.Response, next: express.NextFunction) {
    let bsType: any
    if (res.app.locals.breathingSpaceType === 'STANDARD_BS_ENTERED') {
        bsType = 'Standard breathing space'
    } else {
        bsType = 'Mental health crisis moratorium'
    }

    res.render (Paths.bsCheckAnswersPage.associatedView, {
        form: form,
        breathingSpaceExternalId: res.app.locals.breathingSpaceExternalId,
        breathingSpaceEndDate: moment(res.app.locals.breathingSpaceEndDate).format('MM/DD/YYYY'),
        breathingSpaceEnteredDate: moment(res.app.locals.breathingSpaceEnteredDate).format('MM/DD/YYYY'),
        breathingSpaceReferenceNumber: res.app.locals.breathingSpaceReferenceNumber,
        breathingSpaceType: bsType
    })
}

/* tslint:disable:no-default-export */
export default express.Router()
    .get (Paths.bsCheckAnswersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView (new Form(new BreathingSpace()), res, next)
    })
    .post (
        Paths.bsCheckAnswersPage.uri,
        FormValidator.requestHandler(BreathingSpace),
        ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const form: Form<BreathingSpace> = req.body
            let draft: DraftClaim = new DraftClaim()
            draft.breathingSpace.breathingSpaceReferenceNumber = res.app.locals.breathingSpaceReferenceNumber
            draft.breathingSpace.breathingSpaceExternalId = res.app.locals.breathingSpaceExternalId
            draft.breathingSpace.breathingSpaceType = res.app.locals.breathingSpaceType
            draft.breathingSpace.breathingSpaceEnteredDate = res.app.locals.breathingSpaceEnteredDate
            draft.breathingSpace.breathingSpaceEndDate = res.app.locals.breathingSpaceEndDate

            if (form.hasErrors()) {
                renderView(form, res, next)
            } else {
                await new ClaimStoreClient().saveBreatingSpace(draft, res.locals.user)
                res.redirect(Paths.bsCheckAnswersPage.uri)
            }
        }))
