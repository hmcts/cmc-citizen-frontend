import * as express from 'express'

import { Paths } from 'response/paths'

import { Claim } from 'claims/models/claim'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { MomentFactory } from 'shared/momentFactory'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const draftMediation: Draft<MediationDraft> = res.locals.mediationDraft
      const claim: Claim = res.locals.claim
      const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft
      const beforeYouStartSection = await TaskListBuilder
        .buildBeforeYouStartSection(draft.document, claim, MomentFactory.currentDateTime())
      const respondToClaimSection = TaskListBuilder
        .buildRespondToClaimSection(draft.document, claim)
      const resolvingClaimSection = TaskListBuilder
        .buildResolvingClaimSection(draft.document, claim, draftMediation.document)

      let directionsQuestionnaireSection
      if (FeatureToggles.isEnabled('directionsQuestionnaire') && ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
        directionsQuestionnaireSection = TaskListBuilder.buildDirectionsQuestionnaireSection(draft.document, claim, directionQuestionnaireDraft.document)
      }

      const submitSection = TaskListBuilder.buildSubmitSection(claim, draft.document, claim.externalId)

      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStartSection: beforeYouStartSection,
          submitSection: submitSection,
          respondToClaimSection: respondToClaimSection,
          resolvingClaimSection: resolvingClaimSection,
          directionsQuestionnaireSection: directionsQuestionnaireSection,
          claim: claim
        })
    } catch (err) {
      next(err)
    }
  })
