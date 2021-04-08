import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { DraftClaim } from 'drafts/models/draftClaim'

function renderView (form: Form<BreathingSpace>, res: express.Response, next: express.NextFunction) {
  let bsType: any
  let bsEnteredDate: any
  let bsEndDate: any
  if (res.app.locals.breathingSpaceType === 'STANDARD_BS_ENTERED') {
    bsType = 'Standard breathing space'
  } else {
    bsType = 'Mental health crisis moratorium'
  }
  if (res.app.locals.breathingSpaceEndDate) {
    if (res.app.locals.breathingSpaceEndDate.day !== undefined) {
      bsEndDate = res.app.locals.breathingSpaceEndDate.toMoment().format('DD MMMM YYYY')
    }
  }

  if (res.app.locals.breathingSpaceEnteredDate) {
    if (res.app.locals.breathingSpaceEnteredDate.day !== undefined) {
      bsEnteredDate = res.app.locals.breathingSpaceEnteredDate.toMoment().format('DD MMMM YYYY')
    }
  }

  res.render(Paths.bsCheckAnswersPage.associatedView, {
    form: form,
    breathingSpaceExternalId: res.app.locals.breathingSpaceExternalId,
    breathingSpaceEndDate: bsEndDate,
    breathingSpaceEnteredDate: bsEnteredDate,
    breathingSpaceReferenceNumber: res.app.locals.breathingSpaceReferenceNumber,
    breathingSpaceType: bsType
  })
}

/*  tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsCheckAnswersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(new BreathingSpace()), res, next)
    })
    .post(
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
        draft.breathingSpace.breathingSpaceLiftedFlag = 'No'

        if (form.hasErrors()) {
          renderView(form, res, next)
        } else {
          try {
            await new ClaimStoreClient().saveBreatingSpace(draft, res.locals.user)
            res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', res.app.locals.breathingSpaceExternalId))
          } catch {
            res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', res.app.locals.breathingSpaceExternalId))
          }
        }
      }))
