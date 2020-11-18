import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { AlternativeCourtOption, HearingLocation, ValidationErrors } from 'directions-questionnaire/forms/models/hearingLocation'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Court } from 'court-finder-client/court'
import { Claim } from 'claims/models/claim'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseDraft } from 'response/draft/responseDraft'
import { MadeBy } from 'claims/models/madeBy'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { User } from 'idam/user'
import { PartyDetails } from 'forms/models/partyDetails'
import { CourtDetails } from 'court-finder-client/courtDetails'

function renderPage (res: express.Response, form: Form<HearingLocation>, resultPage: boolean, apiError: string) {
  res.render(Paths.hearingLocationPage.associatedView, {
    form: form,
    resultPage: resultPage,
    party: getUsersRole(res.locals.claim, res.locals.user),
    error: apiError
  })
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

async function getNearestCourtDetails (res: express.Response): Promise<CourtDetails> {
  const postcode: string = getDefaultPostcode(res)
  const nearestCourt: Court = await Court.getNearestCourt(postcode)
  let nearestCourtDetails: CourtDetails = undefined
  if (nearestCourt) {
    nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
  }

  return nearestCourtDetails
}

async function postCodeSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ''
  const searchParam = form.model.alternativePostcode
  if (searchParam !== undefined) {
    const court: Court = await Court.getNearestCourt(searchParam)
    if (court !== undefined) {
      let courtDetails: CourtDetails[] = []
      courtDetails.push(await Court.getCourtDetails(court.slug))
      const nearestCourtDetails: CourtDetails = await getNearestCourtDetails(res)

      renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
            undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
            draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
            form.model.alternativePostcode, undefined, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_POSTCODE
            )), true, apiError)
    } else {
      await handlePostCodeSearchError(res, form, draft, resultPage)
    }
  } else {
    await handlePostCodeSearchError(res, form, draft, resultPage)
  }
}

async function handlePostCodeSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ''
  if ((form.model.courtAccepted === YesNoOption.NO || form.model.alternativeCourtSelected === 'no') && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
    apiError = ValidationErrors.NO_ALTERNATIVE_POSTCODE_SUMMARY
  } else if ((form.model.courtAccepted === YesNoOption.NO || form.model.alternativeCourtSelected === 'no') && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
    apiError = ValidationErrors.NO_ALTERNATIVE_COURT_NAME_SUMMARY
  }
  if (resultPage) {
    if (form.model.searchType === AlternativeCourtOption.BY_NAME) {
      await handleLocationSearchError(res, form, draft, resultPage)
    } else {
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
      } else {
        renderPage(res, form, false, apiError)
      }
    }
  } else {
    renderPage(res, form, resultPage, apiError)
  }
}

async function locationSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean,
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
        await handleLocationSearchError(res, form, draft, resultPage)
      }
    }
  } else {
    if (errorHandling) {
      renderPage(res, form, resultPage, apiError)
    } else {
      await handleLocationSearchError(res, form, draft, resultPage)
    }
  }
}

async function handleLocationSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ''
  if ((form.model.courtAccepted === YesNoOption.NO || form.model.alternativeCourtSelected === 'no') && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
    apiError = ValidationErrors.NO_ALTERNATIVE_POSTCODE_SUMMARY
  } else if ((form.model.courtAccepted === YesNoOption.NO || form.model.alternativeCourtSelected === 'no') && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
    apiError = ValidationErrors.NO_ALTERNATIVE_COURT_NAME_SUMMARY
  }
  if (resultPage) {
    if (form.model.searchType === AlternativeCourtOption.BY_POSTCODE) {
      await handlePostCodeSearchError(res, form, draft, resultPage)
    } else {
      await locationSearch(res, form, draft, resultPage, form.model.searchParam, apiError, true)
    }
  } else {
    renderPage(res, form, resultPage, apiError)
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
          renderPage(res, new Form<HearingLocation>(new HearingLocation()), true, apiError)
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
        if (form.model.searchLoop) {
          const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
          draft.document.hearingLocation = form.model
          if (form.model.searchType === AlternativeCourtOption.BY_POSTCODE) {
            await handlePostCodeSearchError(res, form, draft, true)
          } else if (form.model.searchType === AlternativeCourtOption.BY_NAME) {
            await handleLocationSearchError(res, form, draft, true)
          } else {
            renderPage(res, form, false, undefined)
          }
        } else {
          renderPage(res, form, false, undefined)
        }
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
                draft.document.hearingLocation.courtAccepted = form.model.courtAccepted

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
