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
import { ExceptionalCircumstancesGuard } from 'directions-questionnaire/guard/exceptionalCircumstancesGuard'
import { MadeBy } from 'claims/models/madeBy'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'
import { HearingLocation } from 'directions-questionnaire/forms/models/hearingLocation'

function renderPage (res: express.Response, form: Form<ExceptionalCircumstances>) {
  const party: MadeBy = getUsersRole(res.locals.claim, res.locals.user)
  let defendantCourt = ''
  if (party === MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
    const defendantDirectionsQuestionnaire: DirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire
    defendantCourt = defendantDirectionsQuestionnaire.hearingLocation.courtName
  }
  res.render(Paths.hearingExceptionalCircumstancesPage.associatedView, {
    form: form,
    party: party,
    courtName: defendantCourt
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingExceptionalCircumstancesPage.uri,
    ExceptionalCircumstancesGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<ExceptionalCircumstances>(draft.document.exceptionalCircumstances))
    })
  .post(Paths.hearingExceptionalCircumstancesPage.uri,
    ExceptionalCircumstancesGuard.requestHandler,
    FormValidator.requestHandler(ExceptionalCircumstances, ExceptionalCircumstances.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ExceptionalCircumstances> = req.body
      const party: MadeBy = getUsersRole(res.locals.claim, res.locals.user)

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        if (party === MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
          const defendantDirectionsQuestionnaire: DirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire

          if (form.model.exceptionalCircumstances.option === YesNoOption.YES.option) {
            draft.document.hearingLocation.courtName = defendantDirectionsQuestionnaire.hearingLocation.courtName
            form.model.reason = undefined
          }
        } else {
          if (form.model.exceptionalCircumstances.option === YesNoOption.NO.option) {
            draft.document.hearingLocation = new HearingLocation()
            // todo remove the below line once the backend validation of mandatory is removed for courtName
            draft.document.hearingLocation.courtName = ''
            form.model.reason = undefined
          }
        }
        draft.document.exceptionalCircumstances = form.model
        await new DraftService().save(draft, user.bearerToken)
        if (party === MadeBy.CLAIMANT) {
          if (form.model.exceptionalCircumstances.option === YesNoOption.YES.option) {
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          } else {
            res.redirect(Paths.hearingLocationPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } else {
          if (form.model.exceptionalCircumstances.option === YesNoOption.YES.option) {
            res.redirect(Paths.hearingLocationPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          } else {
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        }
      }
    }))
