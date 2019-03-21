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

