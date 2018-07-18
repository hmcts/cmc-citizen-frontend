import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { ChooseHowToProceed, ChooseHowToProceedOption } from 'claimant-response/form/models/chooseHowToProceed'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

function renderView (form: Form<ChooseHowToProceed>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.chooseHowToProceedPage.associatedView, {
      form: form,
      ChooseHowToProceedOption: ChooseHowToProceedOption
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
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

      renderView(new Form(draft.document.chooseHowToRespond), res, next)
    })
  .post(
    Paths.chooseHowToProceedPage.uri,
    FormValidator.requestHandler(ChooseHowToProceed),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<ChooseHowToProceed> = req.body
      // console.log('form----------->',form)
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user

        console.log('draft------',draft)

        draft.document.chooseHowToRespond = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (ChooseHowToProceedOption.all().includes(form.model.option)) {
          res.render(Paths.chooseHowToProceedPage.associatedView,
            {
              taskListUri: Paths.taskListPage.evaluateUri({ externalId: claim.externalId })
            }
          )
        }
      }
    })
  )
