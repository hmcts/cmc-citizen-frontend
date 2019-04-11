import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Form } from 'forms/form'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'

function renderPage (res: express.Response, form: Form<OtherWitnesses>) {
  res.render(Paths.otherWitnessesPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.otherWitnessesPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<OtherWitnesses>(draft.document.otherWitnesses))
    })
  .post(Paths.otherWitnessesPage.uri, FormValidator.requestHandler(OtherWitnesses, OtherWitnesses.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<OtherWitnesses> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        draft.document.otherWitnesses = form.model

        if (draft.document.otherWitnesses.otherWitnesses === false) {
          draft.document.otherWitnesses.howMany = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.hearingDatesPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    }))
