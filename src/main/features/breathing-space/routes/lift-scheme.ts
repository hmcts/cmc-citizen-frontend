import * as express from 'express'

import { Paths } from 'breathing-space/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { DraftClaim } from 'drafts/models/draftClaim'
import { BreathingSpaceLiftDate } from '../models/bsLiftDate'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'

/*  tslint:disable:no-default-export */
export default express.Router()
    .get(Paths.bsLiftCheckAnswersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let draft: Draft<DraftClaim> = res.locals.Draft
      let breatingSpaceLiftedData: any
      let breathingSpaceExternalId: any
      if (draft.document.breathingSpace !== undefined) {
        breatingSpaceLiftedData = draft.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate ? draft.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate : undefined
        breathingSpaceExternalId = draft.document.breathingSpace.breathingSpaceExternalId !== undefined ? draft.document.breathingSpace.breathingSpaceExternalId : undefined
      }
      res.render(Paths.bsLiftCheckAnswersPage.associatedView,
        {
          breatingSpaceLiftedData: breatingSpaceLiftedData,
          breathingSpaceExternalId: breathingSpaceExternalId
        })
    })
    .post(
      Paths.bsLiftCheckAnswersPage.uri,
      FormValidator.requestHandler(BreathingSpaceLiftDate),
      ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let draftBS: Draft<DraftClaim> = res.locals.Draft
        let draft: DraftClaim = new DraftClaim()
        try {
          draft.breathingSpace.breathingSpaceLiftedFlag = 'Yes'
          draft.breathingSpace.breathingSpaceExternalId = draftBS.document.breathingSpace.breathingSpaceExternalId
          draft.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate = draftBS.document.breathingSpace.breathingSpaceLiftedbyInsolvencyTeamDate
          draft.breathingSpace.breathingSpaceReferenceNumber = draftBS.document.breathingSpace.breathingSpaceReferenceNumber
          draft.breathingSpace.breathingSpaceType = draftBS.document.breathingSpace.breathingSpaceType
          draft.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate = draftBS.document.breathingSpace.breathingSpaceEnteredbyInsolvencyTeamDate
          draft.breathingSpace.breathingSpaceEnteredDate = draftBS.document.breathingSpace.breathingSpaceEnteredDate
          draft.breathingSpace.breathingSpaceEndDate = draftBS.document.breathingSpace.breathingSpaceEndDate
          await new ClaimStoreClient().saveBreatingSpace(draft, res.locals.user)
          await new DraftService().delete(draftBS.id, res.locals.user.bearerToken)
          res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', draft.breathingSpace.breathingSpaceExternalId))
        } catch (error) {
          await new DraftService().delete(draftBS.id, res.locals.user.bearerToken)
          res.redirect(DashboardPaths.claimantPage.uri.replace(':externalId', draft.breathingSpace.breathingSpaceExternalId))
        }
      }))
