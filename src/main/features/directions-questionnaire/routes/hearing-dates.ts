/* tslint:disable:no-default-export */
import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Availability } from 'directions-questionnaire/forms/models/availability'
import { LocalDate } from 'forms/models/localDate'

function renderPage (res: express.Response, form: Form<Availability>) {
  const dates = (form.model && form.model.unavailableDates ? form.model.unavailableDates : [])
    .map(rawDate => LocalDate.fromObject(rawDate))
    .map(localDate => localDate.toMoment())

  res.render(Paths.hearingDatesPage.associatedView, {
    externalId: res.locals.claim.externalId,
    form: form,
    dates: dates
  })
}

const ignoreNewDateIfNotAdding = (req: express.Request, res: express.Response, next) => {
  const form: Form<Availability> = req.body
  if (!form.rawData['addDate']) {
    form.errors = form.errors.filter(error => error.fieldName !== 'newDate')
    delete form.model.newDate
  }
  next()
}

const ignoreEmptyArrayIfAdding = (req: express.Request, res: express.Response, next) => {
  const form: Form<Availability> = req.body
  if (form.rawData['addDate']) {
    form.errors = form.errors.filter(error => error.fieldName !== 'unavailableDates')
  }
  next()
}

const ignorePopulatedArrayIfNoJS = (req: express.Request, res: express.Response, next) => {
  const form: Form<Availability> = req.body
  if (!form.rawData['noJS']) {
    form.errors = form.errors.filter(error => error.fieldName !== 'unavailableDates')
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
    ignoreEmptyArrayIfAdding,
    ignorePopulatedArrayIfNoJS,
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
          renderPage(res, form)
        } else {
          res.redirect(Paths.supportPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    }))
