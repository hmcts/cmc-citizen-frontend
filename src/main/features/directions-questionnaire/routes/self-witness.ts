import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { Form } from 'forms/form'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'

function renderPage (res: express.Response, form: Form<SelfWitness>) {
  res.render(Paths.selfWitnessPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.selfWitnessPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<SelfWitness>(draft.document.selfWitness))
    })
  .post(Paths.selfWitnessPage.uri, FormValidator.requestHandler(SelfWitness, SelfWitness.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<SelfWitness> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        draft.document.selfWitness = form.model

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.otherWitnessesPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    }))
