import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { ExceptionalCircumstances } from 'directions-questionnaire/forms/models/exceptionalCircumstances'
import { Form } from 'forms/form'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'models/yesNoOption'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'

function renderPage (res: express.Response, form: Form<ExceptionalCircumstances>) {
  res.render(Paths.hearingExceptionalCircumstancesPage.associatedView, { form: form, currentParty: getUsersRole(res.locals.claim, res.locals.user) })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingExceptionalCircumstancesPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<ExceptionalCircumstances>(draft.document.exceptionalCircumstances))
    })
  .post(Paths.hearingExceptionalCircumstancesPage.uri, FormValidator.requestHandler(ExceptionalCircumstances, ExceptionalCircumstances.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ExceptionalCircumstances> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        draft.document.exceptionalCircumstances = form.model

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option.option === YesNoOption.YES.option) {
          res.redirect(Paths.hearingLocationPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    }))
