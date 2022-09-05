/* tslint:disable:no-default-export */
import * as express from 'express'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Paths } from 'directions-questionnaire/paths'
import { User } from 'idam/user'
import { DeterminationWithoutHearingQuestions } from 'directions-questionnaire/forms/models/determinationWithoutHearingQuestions'

function renderPage (res: express.Response, form: Form<DeterminationWithoutHearingQuestions>) {
  res.render(Paths.determinationWithoutHearingQuestionsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.determinationWithoutHearingQuestionsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    renderPage(res, new Form<DeterminationWithoutHearingQuestions>(draft.document.determinationWithoutHearingQuestions))
  })
  .post(Paths.determinationWithoutHearingQuestionsPage.uri,
    FormValidator.requestHandler(DeterminationWithoutHearingQuestions, DeterminationWithoutHearingQuestions.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<DeterminationWithoutHearingQuestions> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        draft.document.determinationWithoutHearingQuestions = form.model

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.supportPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
