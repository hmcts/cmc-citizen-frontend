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
import { Court } from 'court-finder-client/court'
import { CourtDetails } from 'court-finder-client/courtDetails'
import { CourtLocationType } from 'claims/models/directions-questionnaire/hearingLocation'
import { Claim } from 'claims/models/claim'

function getPostcode (defendantDirectionsQuestionnaire: DirectionsQuestionnaire, claim: Claim) {
  const postcodeFromDirectionQuestionnaire = defendantDirectionsQuestionnaire.hearingLocation.courtAddress !== undefined
    ? defendantDirectionsQuestionnaire.hearingLocation.courtAddress.postcode
    : undefined

  return defendantDirectionsQuestionnaire.hearingLocation.locationOption === CourtLocationType.SUGGESTED_COURT
    ? claim.response.defendant.address.postcode
    : postcodeFromDirectionQuestionnaire
}

async function renderPage (res: express.Response, form: Form<ExceptionalCircumstances>) {
  const party: MadeBy = getUsersRole(res.locals.claim, res.locals.user)
  let defendantCourt = ''
  let courtDetails: CourtDetails = undefined

  if (party === MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
    const claim: Claim = res.locals.claim
    const defendantDirectionsQuestionnaire: DirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire
    const postcode: string = getPostcode(defendantDirectionsQuestionnaire, claim)

    if (postcode) {
      const court: Court = await Court.getNearestCourt(postcode)
      if (court) {
        courtDetails = await Court.getCourtDetails(court.slug)
      }
    }
    defendantCourt = defendantDirectionsQuestionnaire.hearingLocation.courtName
  }

  res.render(Paths.hearingExceptionalCircumstancesPage.associatedView, {
    form: form,
    party: party,
    courtName: defendantCourt,
    facilities: courtDetails ? courtDetails.facilities : undefined
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingExceptionalCircumstancesPage.uri,
    ExceptionalCircumstancesGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      try {
        await renderPage(res, new Form<ExceptionalCircumstances>(draft.document.exceptionalCircumstances))
      } catch (err) {
        next(err)
      }
    })
  .post(Paths.hearingExceptionalCircumstancesPage.uri,
    ExceptionalCircumstancesGuard.requestHandler,
    FormValidator.requestHandler(ExceptionalCircumstances, ExceptionalCircumstances.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ExceptionalCircumstances> = req.body
      const party: MadeBy = getUsersRole(res.locals.claim, res.locals.user)

      if (form.hasErrors()) {
        await renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        if (party === MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
          const defendantDirectionsQuestionnaire: DirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire

          if (form.model.exceptionalCircumstances.option === YesNoOption.NO.option) {
            draft.document.hearingLocation.courtName = defendantDirectionsQuestionnaire.hearingLocation.courtName
            draft.document.hearingLocation.courtAccepted = YesNoOption.YES
            form.model.reason = undefined
          }
        } else if (form.model.exceptionalCircumstances.option === YesNoOption.YES.option) {
          draft.document.hearingLocation = undefined
        }

        draft.document.exceptionalCircumstances = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.exceptionalCircumstances.option === YesNoOption.NO.option) {
          res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(Paths.hearingLocationPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }

      }
    }))
