import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { HearingLocation } from 'directions-questionnaire/forms/models/hearingLocation'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { ErrorHandling } from 'shared/errorHandling'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { Court } from 'court-finder-client/court'
import { CourtDetails } from 'court-finder-client/courtDetails'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'

function renderPage (res: express.Response, form: Form<HearingLocation>, fallbackPage: boolean, courts: CourtDetails[], searchString: string) {
  res.render(Paths.hearingLocationResultPage.associatedView, {
    form: form,
    fallbackPage: fallbackPage,
    party: getUsersRole(res.locals.claim, res.locals.user),
    courts: courts,
    searchString: searchString
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationResultPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      const searchParam = req.query.name

      const courts: Court[] = await Court.getCourtsByName(searchParam)
      if (courts) {
        let courtDetails: CourtDetails[] = []

        for (let court of courts) {
          courtDetails.push(await Court.getCourtDetails(court.slug))
        }
        renderPage(res, new Form<HearingLocation>(new HearingLocation()), false, courtDetails, searchParam)
      } else {
        renderPage(res, new Form<HearingLocation>(new HearingLocation()), true, undefined, searchParam)
      }

    } catch (err) {
      next(err)
    }
  })
  .post(Paths.hearingLocationResultPage.uri,
    FormValidator.requestHandler(HearingLocation, HearingLocation.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HearingLocation> = req.body
      if (form.hasErrors()) {
        renderPage(res, form, false, [], '')
      } else {
        try {

          const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
          const courtDetails: string[] = form.model.alternativeCourtName.split(':')
          if (courtDetails.length === 2) {
            draft.document.hearingLocation = form.model
            draft.document.hearingLocation.alternativeCourtName = courtDetails[0]
            draft.document.hearingLocationSlug = courtDetails[1]
          } else {
            draft.document.hearingLocation = form.model
          }

          const user: User = res.locals.user
          await new DraftService().save(draft, user.bearerToken)
          res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } catch (err) {
          next(err)
        }
      }
    }))
