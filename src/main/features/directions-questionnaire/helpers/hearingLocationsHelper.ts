import * as express from 'express'
import { AlternativeCourtOption, HearingLocation, ValidationErrors } from 'directions-questionnaire/forms/models/hearingLocation'
import { Claim } from 'claims/models/claim'
import { Court } from 'court-finder-client/court'
import { CourtDetails } from 'court-finder-client/courtDetails'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Form } from 'forms/form'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { PartyDetails } from 'forms/models/partyDetails'
import { ResponseDraft } from 'response/draft/responseDraft'
import { MadeBy } from 'claims/models/madeBy'
import { renderPage } from 'directions-questionnaire/routes/hearing-location'
import { User } from 'idam/user'
import { YesNoOption } from 'models/yesNoOption'

export function validateFormForErrors (form: Form<HearingLocation>, apiError: string): string {
  if (!apiError && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
    apiError = ValidationErrors.NO_ALTERNATIVE_POSTCODE_SUMMARY
  } else if (!apiError && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
    apiError = ValidationErrors.NO_ALTERNATIVE_COURT_NAME_SUMMARY
  }
  return apiError
}

export async function searchByPostCodeForEdgecase (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ''
  const court: Court = await Court.getNearestCourt(form.model.alternativePostcode)
  if (court !== undefined) {
    let courtDetails: CourtDetails[] = []
    courtDetails.push(await Court.getCourtDetails(court.slug))

    draft.document.hearingLocation.courtName = court.name
    draft.document.hearingLocation.courtPostcode = court.addresses[0].postcode
    draft.document.hearingLocation.courtAccepted = YesNoOption.NO

    renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
        undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
        draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
        form.model.alternativePostcode, undefined, courtDetails, form.model.alternativePostcode, undefined, true, AlternativeCourtOption.BY_POSTCODE
        )), true, apiError)
  } else {
    await handlePostCodeSearchError(res, form, draft, resultPage, apiError)
  }
}

export async function postCodeSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ''
  const court: Court = await Court.getNearestCourt(form.model.alternativePostcode)
  if (court !== undefined) {
    let courtDetails: CourtDetails[] = []
    courtDetails.push(await Court.getCourtDetails(court.slug))
    const nearestCourtDetails: CourtDetails = await getNearestCourtDetails(res)

    renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
        undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
        draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
        form.model.alternativePostcode, undefined, courtDetails, form.model.alternativePostcode, nearestCourtDetails, true, AlternativeCourtOption.BY_POSTCODE
        )), true, apiError)
  } else {
    await handlePostCodeSearchError(res, form, draft, resultPage, undefined)
  }
}

export async function locationSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean,
  searchParam: string, apiError: string, errorHandling: boolean) {
  if (searchParam !== undefined) {
    const courts: Court[] = await Court.getCourtsByName(searchParam)
    if (courts) {
      let courtDetails: CourtDetails[] = []
      for (let court of courts) {
        courtDetails.push(await Court.getCourtDetails(court.slug))
      }
      const nearestCourtDetails: CourtDetails = await getNearestCourtDetails(res)
      renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
        undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
        draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
        form.model.alternativePostcode, form.model.alternativeCourtSelected, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_NAME
      )), true, apiError)
    } else {
      if (errorHandling) {
        renderPage(res, form, resultPage, apiError)
      } else {
        await handleLocationSearchError(res, form, draft, resultPage, undefined)
      }
    }
  } else {
    if (errorHandling) {
      renderPage(res, form, resultPage, apiError)
    } else {
      await handleLocationSearchError(res, form, draft, resultPage, undefined)
    }
  }
}

export async function handlePostCodeSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean, apiError: string) {
  apiError = validateFormForErrors(form, apiError)
  if (resultPage) {
    const searchParam = form.model.searchParam
    if (searchParam !== undefined) {
      const court: Court = await Court.getNearestCourt(searchParam)
      if (court !== undefined) {
        let courtDetails: CourtDetails[] = []
        courtDetails.push(await Court.getCourtDetails(court.slug))
        const nearestCourtDetails: CourtDetails = await getNearestCourtDetails(res)

        renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
        undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
        draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
        form.model.alternativePostcode, form.model.alternativeCourtSelected, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_POSTCODE
        )), resultPage, apiError)
      } else {
        renderPage(res, form, false, apiError)
      }
    }
  } else {
    renderPage(res, form, resultPage, apiError)
  }
}

export async function getNearestCourtDetails (res: express.Response): Promise<CourtDetails> {
  const postcode: string = getDefaultPostcode(res)
  const nearestCourt: Court = await Court.getNearestCourt(postcode)
  let nearestCourtDetails: CourtDetails = undefined
  if (nearestCourt) {
    nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
  }
  return nearestCourtDetails
}

function getDefaultPostcode (res: express.Response): string {
  const claim: Claim = res.locals.claim
  const user: User = res.locals.user
  if (getUsersRole(claim, user) === MadeBy.DEFENDANT) {
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    const partyDetails: PartyDetails = responseDraft.document.defendantDetails.partyDetails
    if (partyDetails && partyDetails.address.postcode) {
      return responseDraft.document.defendantDetails.partyDetails.address.postcode
    } else {
      return claim.claimData.defendant.address.postcode
    }
  } else {
    return claim.claimData.claimant.address.postcode
  }
}

export async function handleLocationSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean, apiError: string) {
  apiError = validateFormForErrors(form, apiError)
  if (resultPage) {
    if (form.model.searchType === AlternativeCourtOption.BY_POSTCODE) {
      await handlePostCodeSearchError(res, form, draft, resultPage, undefined)
    } else {
      await locationSearch(res, form, draft, resultPage, form.model.searchParam, apiError, true)
    }
  } else {
    renderPage(res, form, resultPage, apiError)
  }
}
