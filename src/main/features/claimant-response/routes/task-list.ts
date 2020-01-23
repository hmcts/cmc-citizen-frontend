import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ErrorHandling } from 'shared/errorHandling'
import { MediationDraft } from 'mediation/draft/mediationDraft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft
      const claim: Claim = res.locals.claim

      const beforeYouStartSection = TaskListBuilder
        .buildDefendantResponseSection(draft.document, claim)
      const howYouWantToRespondSection = TaskListBuilder
        .buildHowYouWantToRespondSection(draft.document, claim, mediationDraft.document)
      const submitSection = TaskListBuilder
        .buildSubmitSection(draft.document, claim.externalId)
      const directionsQuestionnaireSection = TaskListBuilder
        .buildDirectionsQuestionnaireSection(draft.document, claim, directionsQuestionnaireDraft.document)

      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStartSection: beforeYouStartSection,
          howYouWantToRespondSection: howYouWantToRespondSection,
          submitSection: submitSection,
          directionsQuestionnaireSection: directionsQuestionnaireSection,
          claim: claim
        })
    })
  )
