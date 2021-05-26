import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { AlternativeCourtOption, HearingLocation, ValidationErrors } from 'directions-questionnaire/forms/models/hearingLocation'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Court } from 'court-finder-client/court'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { YesNoOption } from 'models/yesNoOption'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { User } from 'idam/user'

import { CourtDetails } from 'court-finder-client/courtDetails'
import { handlePostCodeSearchError, getNearestCourtDetails, handleLocationSearchError, postCodeSearch,
  locationSearch, searchByPostCodeForEdgecase } from 'directions-questionnaire/helpers/hearingLocationsHelper'

export function renderPage (res: express.Response, form: Form<HearingLocation>, resultPage: boolean, apiError: string) {
  res.render(Paths.hearingLocationPage.associatedView, {
    form: form,
    resultPage: resultPage,
    party: getUsersRole(res.locals.claim, res.locals.user),
    error: apiError
  })
}

async function handleFormError (res: express.Response, form: Form<HearingLocation>, resultPage: boolean, apiError: string) {
  if (form.model.searchLoop) {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    draft.document.hearingLocation = form.model
    if (form.model.searchType === AlternativeCourtOption.BY_POSTCODE) {
      await handlePostCodeSearchError(res, form, draft, true, apiError)
    } else if (form.model.searchType === AlternativeCourtOption.BY_NAME) {
      await handleLocationSearchError(res, form, draft, true, apiError)
    } else {
      renderPage(res, form, false, undefined)
    }
  } else {
    renderPage(res, form, false, undefined)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      let apiError = ''
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft

      if (draft.document.hearingLocation.alternativeOption !== undefined
          && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_SEARCH) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.alternativeCourtName, draft.document.hearingLocation.alternativePostcode, draft.document.hearingLocation.facilities, YesNoOption.YES, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName, undefined
            )), false, apiError)
      } else if (draft.document.hearingLocation.alternativeOption !== undefined
          && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.NEAREST_COURT_SELECTED) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.courtName, undefined, draft.document.hearingLocation.facilities, YesNoOption.YES, undefined, undefined, undefined, undefined, undefined, undefined
            )), false, apiError)
      } else {
        const courtDetails: CourtDetails = await getNearestCourtDetails(res)
        if (courtDetails) {
          renderPage(res,
            new Form<HearingLocation>(
              new HearingLocation(
                courtDetails.name, undefined, courtDetails.facilities, YesNoOption.YES
              )), false, apiError)
        } else {
          renderPage(res, new Form<HearingLocation>(new HearingLocation()), false, apiError)
        }
      }
    } catch (err) {
      next(err)
    }
  })
  .post(Paths.hearingLocationPage.uri, FormValidator.requestHandler(HearingLocation, HearingLocation.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HearingLocation> = req.body

      if (form.hasErrors()) {
        handleFormError(res, form, true, undefined)
      } else if (form.model.courtAccepted === undefined && form.model.alternativeCourtSelected === undefined &&
        form.model.courtName) {
        await handleFormError(res, form, true, ValidationErrors.SELECT_ALTERNATIVE_OPTION)
      } else {
        try {
          const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
          const user: User = res.locals.user
          draft.document.hearingLocation = form.model
          if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            await postCodeSearch(res, form, draft, false)
          } else if (form.model.alternativeCourtSelected === 'no' && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            await postCodeSearch(res, form, draft, true)
          } else if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            await locationSearch(res, form, draft, false, form.model.alternativeCourtName, '', false)
          } else if (form.model.alternativeCourtSelected === 'no' && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            await locationSearch(res, form, draft, true, form.model.alternativeCourtName, '', false)
          } else if (form.model.courtAccepted === undefined && form.model.alternativeCourtSelected === undefined &&
            (form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE)) {
            await searchByPostCodeForEdgecase(res, form, draft, false)
          } else if (form.model.courtAccepted === undefined && form.model.alternativeCourtSelected === undefined &&
            (form.model.alternativeOption === AlternativeCourtOption.BY_NAME)) {
            await locationSearch(res, form, draft, false, form.model.alternativeCourtName, '', false)
          } else {
            if (form.model.alternativeOption !== undefined
                && form.model.alternativeOption === AlternativeCourtOption.NEAREST_COURT_SELECTED) {
              const nearestCourtDetails: CourtDetails = await getNearestCourtDetails(res)
              if (nearestCourtDetails) {
                draft.document.hearingLocation = form.model
                draft.document.hearingLocation.courtName = nearestCourtDetails.name
                draft.document.hearingLocation.alternativeOption = AlternativeCourtOption.NEAREST_COURT_SELECTED
                draft.document.hearingLocationSlug = nearestCourtDetails.slug
                draft.document.hearingLocation.facilities = nearestCourtDetails.facilities
                draft.document.hearingLocation.courtAccepted = form.model.courtAccepted === undefined ? YesNoOption.YES : form.model.courtAccepted

                await new DraftService().save(draft, user.bearerToken)
              }
            } else if (form.model.alternativeCourtSelected !== undefined && form.model.alternativeCourtSelected !== 'no') {
              let courtDetail: CourtDetails = undefined
              const court: Court[] = await Court.getCourtsByName(form.model.alternativeCourtSelected)
              if (court[0]) {
                courtDetail = await Court.getCourtDetails(court[0].slug)
                draft.document.hearingLocation = form.model
                draft.document.hearingLocation.courtName = courtDetail.name
                draft.document.hearingLocation.alternativeCourtName = courtDetail.name
                draft.document.hearingLocation.alternativeOption = AlternativeCourtOption.BY_SEARCH
                draft.document.hearingLocation.courtAccepted = YesNoOption.YES
                draft.document.hearingLocationSlug = courtDetail.slug
                draft.document.hearingLocation.facilities = courtDetail.facilities

                await new DraftService().save(draft, user.bearerToken)
              }
            } else {
              draft.document.hearingLocation = form.model
              draft.document.hearingLocation.courtName = form.model.courtName
              draft.document.hearingLocation.courtAccepted = form.model.courtAccepted
              draft.document.hearingLocation.facilities = form.model.facilities

              await new DraftService().save(draft, user.bearerToken)
            }
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } catch (err) {
          next(err)
        }
      }
    }))
