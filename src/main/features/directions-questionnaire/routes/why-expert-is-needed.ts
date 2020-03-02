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
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

function renderPage (res: express.Response, form: Form<WhyExpertIsNeeded>) {
  res.render(Paths.whyExpertIsNeededPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.whyExpertIsNeededPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    renderPage(res, new Form<WhyExpertIsNeeded>(draft.document.whyExpertIsNeeded))
  })
  .post(Paths.whyExpertIsNeededPage.uri,
    FormValidator.requestHandler(WhyExpertIsNeeded, WhyExpertIsNeeded.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<WhyExpertIsNeeded> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        draft.document.whyExpertIsNeeded = form.model

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
