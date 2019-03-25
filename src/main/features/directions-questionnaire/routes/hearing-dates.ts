/* tslint:disable:no-default-export */
import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Availability } from 'directions-questionnaire/forms/models/availability'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { MadeBy } from 'offer/form/models/madeBy'
import { LocalDate } from 'forms/models/localDate'

function renderPage (res: express.Response, form: Form<Availability>) {
  res.render(Paths.hearingDatesPage.associatedView, {
    externalId: res.locals.claim.claimData.externalId,
    form: form,
    dates: (form.model && form.model.unavailableDates ? form.model.unavailableDates : [])
      .map(rawDate => LocalDate.fromObject(rawDate))
      .map(localDate => localDate.toMoment())
  })
}

const ignoreNewDateIfNotAdding = (req: express.Request, res: express.Response, next) => {
  if (!req.body.rawData.addDate) {
    req.body.errors = req.body.errors.filter(error => error.fieldName !== 'newDate')
    delete req.body.model.newDate
  }
  next()
}

export default express.Router()
  .get(Paths.hearingDatesPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<Availability>(draft.document.availability))
    })

  .post(Paths.hearingDatesPage.uri,
    FormValidator.requestHandler(Availability, Availability.fromObject),
    ignoreNewDateIfNotAdding,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Availability> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {

        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user = res.locals.user

        draft.document.availability = form.model
        draft.document.availability.unavailableDates = [...form.model.unavailableDates, form.model.newDate]
          .filter(date => !!date)
          .sort((date1, date2) => date1.toMoment().diff(date2.toMoment()))
          .map(date => LocalDate.fromObject(date))
        delete draft.document.availability.newDate
        if (!req.body.rawData.addDate && !form.model.hasUnavailableDates) {
          delete draft.document.availability.unavailableDates
        }

        await new DraftService().save(draft, user.bearerToken)

        if (req.body.rawData.addDate) {
          res.redirect(Paths.hearingDatesPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else if (getUsersRole(res.locals.claim, user) === MadeBy.DEFENDANT) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    }))
