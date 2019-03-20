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
import * as Moment from 'moment'

function renderPage (res: express.Response, form: Form<Availability>) {
  res.render(Paths.hearingDatesPage.associatedView, {
    externalId: res.locals.claim.claimData.externalId,
    form: form,
    dates: (form.model ? form.model.unavailableDates : [])
      .map(rawDate => LocalDate.fromObject(rawDate))
      .map(localDate => localDate.toMoment())
  })
}

function renderFragment (res: express.Response, draft: Draft<DirectionsQuestionnaireDraft>) {
  res.render('directions-questionnaire/views/components/date-list', {
    dates: draft.document.availability.unavailableDates
      .map(rawDate => LocalDate.fromObject(rawDate))
      .map(localDate => localDate.toMoment()),
    externalId: res.locals.claim.externalId
  })
}

function sortDates (dates: LocalDate[]): LocalDate[] {
  if (!dates) {
    return []
  }
  return dates.sort((date1, date2) => Moment(date1).valueOf() - Moment(date2).valueOf())
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingDatesPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<Availability>(draft.document.availability))
    })
  .post(Paths.hearingDatesPage.uri,
    FormValidator.requestHandler(Availability, Availability.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Availability> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user = res.locals.user

        draft.document.availability = form.model

        await new DraftService().save(draft, user.bearerToken)

        let url
        if (getUsersRole(res.locals.claim, user) === MadeBy.DEFENDANT) {
          url = ResponsePaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId })
        } else {
          url = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId })
        }
        res.redirect(url)
      }
    }))

  .post(Paths.hearingDatesUpdateReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      const unavailableDates = req.body.unavailableDates
      draft.document.availability = draft.document.availability || new Availability(undefined, [])

      const availability = draft.document.availability
      if (req.params.method === 'replace') {
        availability.unavailableDates = sortDates(unavailableDates)
      } else if (req.params.method === 'remove') {

      }
      const user = res.locals.user
      await new DraftService().save(draft, user.bearerToken)
      renderFragment(res, draft)
    })
  )
