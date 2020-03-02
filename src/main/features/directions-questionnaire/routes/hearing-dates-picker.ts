import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Availability, ValidationErrors } from 'directions-questionnaire/forms/models/availability'
import { DraftService } from 'services/draftService'
import { LocalDate } from 'forms/models/localDate'
import * as Moment from 'moment'
import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

function renderFragment (res: express.Response, draft: Draft<DirectionsQuestionnaireDraft>) {
  res.render('directions-questionnaire/views/components/date-list', {
    dates: draft.document.availability && draft.document.availability.unavailableDates
      ? draft.document.availability.unavailableDates
        .map(rawDate => LocalDate.fromObject(rawDate))
        .map(localDate => localDate.toMoment())
      : [],
    externalId: res.locals.claim.externalId
  })
}

function sortDates (dates: LocalDate[]): LocalDate[] {
  if (!dates) {
    return []
  }
  return dates.sort((date1, date2) => Moment(date1).valueOf() - Moment(date2).valueOf())
}

const ignoreEmptyArrayError = (req: express.Request, res: express.Response, next) => {
  const form: Form<Availability> = req.body
  form.errors = form.errors.filter(error => error.message !== ValidationErrors.AT_LEAST_ONE_DATE)
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  /*
   * The delete date functionality comes from a simple hyperlink, hence get.
   * To 'post' would need nested forms for the non-JS page.
   */
  .get(Paths.hearingDatesDeleteReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      draft.document.availability = draft.document.availability || new Availability(undefined, [])

      const availability = draft.document.availability

      // The 'date-' prefix is needed because our RoutablePath class rejects :segments with only numbers
      const dateIndex = Number(/date-([\d+])/.exec(req.params.index)[1])
      availability.unavailableDates = availability.unavailableDates
        .filter((date, index) => index !== dateIndex)
        .map(date => LocalDate.fromObject(date))

      const user = res.locals.user
      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.hearingDatesPage.evaluateUri({ externalId: res.locals.claim.externalId }))
    }))

  .post(Paths.hearingDatesReplaceReceiver.uri,
    FormValidator.requestHandler(Availability, Availability.fromObject),
    ignoreEmptyArrayError,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Availability> = req.body
      if (form.hasErrors()) {
        res.sendStatus(400)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const unavailableDates = form.model.unavailableDates
        draft.document.availability = form.model

        const availability = draft.document.availability
        availability.unavailableDates = sortDates(unavailableDates).map(date => LocalDate.fromObject(date))

        const user = res.locals.user
        await new DraftService().save(draft, user.bearerToken)
        renderFragment(res, draft)
      }
    }))
