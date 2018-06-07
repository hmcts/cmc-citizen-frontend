import * as express from 'express'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { Explanation } from 'response/form/models/statement-of-means/explanation'
import { StatementOfMeansPaths, Paths as Paths } from 'response/paths'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

function renderView (form: Form<Explanation>, res: express.Response) {
  res.render(StatementOfMeansPaths.brieflyExplainWhyCannotPayImmediatelyPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatementOfMeansPaths.brieflyExplainWhyCannotPayImmediatelyPage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.explanation), res)
    }))
  .post(
    StatementOfMeansPaths.brieflyExplainWhyCannotPayImmediatelyPage.uri,
    FormValidator.requestHandler(Explanation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Explanation> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.explanation = form.model
        await new DraftService().save(draft, user.bearerToken)
        const claim: Claim = res.locals.claim

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
