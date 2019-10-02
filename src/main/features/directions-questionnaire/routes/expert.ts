import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'
import { YesNoOption } from 'models/yesNoOption'
import { ExpertReports } from 'directions-questionnaire/forms/models/expertReports'
import { PermissionForExpert } from 'directions-questionnaire/forms/models/permissionForExpert'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.expertPage.uri,
    (req: express.Request, res: express.Response) => res.render(Paths.expertPage.associatedView))
  .post(Paths.expertPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      const user: User = res.locals.user

      const expertRequired: boolean = !!req.body.expertYes

      if (!expertRequired && draft.document.expertRequired && draft.document.expertRequired.option && draft.document.expertRequired.option.option === YesNoOption.YES.option) {
        draft.document.expertReports = new ExpertReports()
        draft.document.permissionForExpert = new PermissionForExpert()
        draft.document.expertEvidence = new ExpertEvidence()
        draft.document.whyExpertIsNeeded = new WhyExpertIsNeeded()
      }

      draft.document.expertRequired = new ExpertRequired(expertRequired ? YesNoOption.YES : YesNoOption.NO)

      await new DraftService().save(draft, user.bearerToken)

      const externalId = res.locals.claim.externalId
      if (expertRequired) {
        if (draft.document.expertReports.declared !== undefined) {
          draft.document.expertReports = new ExpertReports()
        }
        res.redirect(Paths.expertReportsPage.evaluateUri({ externalId }))
      } else {
        res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId }))
      }
    }))
