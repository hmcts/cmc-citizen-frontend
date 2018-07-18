import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { ChooseHowToProceed } from 'claimant-response/form/models/chooseHowToProceed'
import { Form } from 'forms/form'

function renderView (form: Form<ChooseHowToProceed>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.chooseHowToProceedPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.chooseHowToProceedPage.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.draftClaimantResponse

      renderView(new Form(draft.document.chooseHowToRespond), res, next)
    })
  .post(
    Paths.chooseHowToProceedPage.uri,
    FormValidator.requestHandler(ChooseHowToProceed),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<ChooseHowToProceed> = req.body

      if (form.hasErrors()) {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const claim: Claim = res.locals.claim

        res.render(Paths.chooseHowToProceedPage.associatedView,
          {
            taskListUri: Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
            tasks: TaskListBuilder.buildRemainingTasks(draft.document, claim)
          }
        )
      }
    })
  )
