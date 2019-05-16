/* tslint:disable:no-default-export */
import * as express from 'express'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Paths } from 'directions-questionnaire/paths'
import { User } from 'idam/user'

function renderPage (res: express.Response, form: Form<ExpertEvidence>) {
  res.render(Paths.expertPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.expertPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    renderPage(res, new Form<ExpertEvidence>(draft.document.expertEvidence))
  })

  .post(Paths.expertPage.uri,
    FormValidator.requestHandler(ExpertEvidence, ExpertEvidence.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ExpertEvidence> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        draft.document.supportRequired = form.model
        draft.document.expertEvidence = form.model

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.expertYesPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
