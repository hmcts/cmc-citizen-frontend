import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { getPreferredParty, getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { Claim } from 'claims/models/claim'

function renderPage (res: express.Response, form: Form<SupportRequired>) {
  res.render(Paths.supportPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.supportPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    if (draft.document.supportRequired.languageInterpreted === 'None') {
      draft.document.supportRequired.languageInterpreted = ''
    }
    if (draft.document.supportRequired.signLanguageInterpreted === 'None') {
      draft.document.supportRequired.signLanguageInterpreted = ''
    }
    if (draft.document.supportRequired.otherSupport === 'None') {
      draft.document.supportRequired.otherSupport = ''
    }
    renderPage(res, new Form<SupportRequired>(draft.document.supportRequired))
  })
  .post(Paths.supportPage.uri, FormValidator.requestHandler(SupportRequired, SupportRequired.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<SupportRequired> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        draft.document.supportRequired = form.model

        await new DraftService().save(draft, user.bearerToken)
        const claim: Claim = res.locals.claim
        if (getUsersRole(claim, user) === getPreferredParty(claim)) {
          res.redirect(Paths.hearingLocationPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.hearingExceptionalCircumstancesPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))
