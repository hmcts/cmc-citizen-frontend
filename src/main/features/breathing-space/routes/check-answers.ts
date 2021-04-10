import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<BreathingSpace>, res: express.Response, next: express.NextFunction) {
  let bsType: any
  let bsEnteredDate: any
  let bsEndDate: any
  if (form.model.breathingSpaceType === 'STANDARD_BS_ENTERED') {
    bsType = 'Standard breathing space'
  } else {
    bsType = 'Mental health crisis moratorium'
  }
  if (form.model.breathingSpaceEndDate) {
    bsEndDate = form.model.breathingSpaceEndDate
  }

  if (form.model.breathingSpaceType) {
    bsEnteredDate = form.model.breathingSpaceEnteredbyInsolvencyTeamDate
  }

  res.render(Paths.bsCheckAnswersPage.associatedView, {
    form: form,
    breathingSpaceExternalId: form.model.breathingSpaceExternalId,
    breathingSpaceEndDate: bsEndDate,
    breathingSpaceEnteredDate: bsEnteredDate,
    breathingSpaceReferenceNumber: form.model.breathingSpaceReferenceNumber,
    breathingSpaceType: bsType
  })
}

/*  tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsCheckAnswersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let draft: Draft<DraftClaim> = res.locals.Draft
      renderView(new Form(draft.document.breathingSpace), res, next)
    })
    .post(
      Paths.bsCheckAnswersPage.uri,
      FormValidator.requestHandler(BreathingSpace),
      ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let draftBS: Draft<DraftClaim> = res.locals.Draft
        let draft: DraftClaim = new DraftClaim()
        draft.breathingSpace.breathingSpaceReferenceNumber = draftBS.document.breathingSpace.breathingSpaceReferenceNumber
        draft.breathingSpace.breathingSpaceExternalId = draftBS.document.breathingSpace.breathingSpaceExternalId
        draft.breathingSpace.breathingSpaceType = draftBS.document.breathingSpace.breathingSpaceType
        draft.breathingSpace.breathingSpaceEnteredDate = draftBS.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate
        draft.breathingSpace.breathingSpaceEndDate = draftBS.document.breathingSpace.breathingSpaceEndDate
        draft.breathingSpace.breathingSpaceLiftedFlag = 'No'
        try {
          await new ClaimStoreClient().saveBreatingSpace(draft, res.locals.user)
          await new DraftService().delete(draftBS.id, res.locals.user.bearerToken)
          res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', draft.breathingSpace.breathingSpaceExternalId))
        } catch {
          await new DraftService().delete(draftBS.id, res.locals.user.bearerToken)
          res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', draft.breathingSpace.breathingSpaceExternalId))
        }
      }))
