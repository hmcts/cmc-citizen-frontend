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
  let bsEndDate: any
  if (res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate) {
    if (res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate.day !== undefined) {
      bsEndDate = res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate.toMoment().format('DD MMMM YYYY')
    }
  }

  res.render(Paths.bsLiftCheckAnswersPage.associatedView, {
    form: form,
    breathingSpaceExternalId: res.app.locals.breathingSpaceExternalId,
    breathingSpaceLiftedbyInsolvencyTeamDate: bsEndDate,
  })
}

/*  tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsLiftCheckAnswersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(new BreathingSpace()), res, next)
    })
    .post(
      Paths.bsLiftCheckAnswersPage.uri,
      FormValidator.requestHandler(BreathingSpace),
      ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const form: Form<BreathingSpace> = req.body
        let draft: DraftClaim = new DraftClaim()
        draft.breathingSpace.breathingSpaceLiftedFlag = 'YES'
        draft.breathingSpace.breathingSpaceExternalId = res.app.locals.breathingSpaceExternalId
        draft.breathingSpace.breathingSpaceEndDate = res.app.locals.breathingSpaceLiftedbyInsolvencyTeamDate

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
