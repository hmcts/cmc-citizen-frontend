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

async function postCodeSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  try {
    let apiError = ''
    const searchParam = form.model.alternativePostcode
    if (searchParam === undefined || searchParam.trim() === '') {
      handlePostCodeSearchError(res, form, draft, true)
    }
    const court: Court = await Court.getNearestCourt(searchParam)
    if (court !== undefined) {
      let courtDetails: CourtDetails[] = []
      courtDetails.push(await Court.getCourtDetails(court.slug))
      const postcode: string = getDefaultPostcode(res)
      const nearestCourt: Court = await Court.getNearestCourt(postcode)
      let nearestCourtDetails: CourtDetails = undefined
      if (nearestCourt) {
        nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
      }

      renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
            undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
            draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
            form.model.alternativePostcode, undefined, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_POSTCODE
            )), true, apiError)
    } else {
      handlePostCodeSearchError(res, form, draft, resultPage)
    }
  } catch (err) {
    throw err
  }
}

async function handlePostCodeSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ValidationErrors.NO_ALTERNATIVE_POSTCODE_SUMMARY
  try {
    if (resultPage) {
      const searchParam = form.model.searchParam
      const court: Court = await Court.getNearestCourt(searchParam)
      if (court !== undefined) {
        let courtDetails: CourtDetails[] = []
        courtDetails.push(await Court.getCourtDetails(court.slug))
        const postcode: string = getDefaultPostcode(res)
        const nearestCourt: Court = await Court.getNearestCourt(postcode)
        let nearestCourtDetails: CourtDetails = undefined
        if (nearestCourt) {
          nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
        }

        renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
              undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
              draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
              form.model.alternativePostcode, form.model.alternativeCourtSelected, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_POSTCODE
              )), resultPage, apiError)
      } else {
        renderPage(res, form, false, apiError)
      }
    } else {
      renderPage(res, form, resultPage, apiError)
    }
  } catch (err) {
    throw err
  }
}

async function locationSearch (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  try {
    let apiError = ''
    const searchParam = form.model.alternativeCourtName
    if (searchParam === undefined || searchParam.trim() === '') {
      handleLocationSearchError(res, form, draft, true)
    }
    const courts: Court[] = await Court.getCourtsByName(searchParam)
    if (courts) {
      let courtDetails: CourtDetails[] = []
      for (let court of courts) {
        courtDetails.push(await Court.getCourtDetails(court.slug))
      }
      const postcode: string = getDefaultPostcode(res)
      const nearestCourt: Court = await Court.getNearestCourt(postcode)
      let nearestCourtDetails: CourtDetails = undefined
      if (nearestCourt) {
        nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
      }
      renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
        undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
        draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
        form.model.alternativePostcode, form.model.alternativeCourtSelected, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_NAME
      )), true, apiError)
    } else {
      handleLocationSearchError(res, form, draft, resultPage)
    }
  } catch (err) {
    throw err
  }
}

async function handleLocationSearchError (res: express.Response, form: Form<HearingLocation>, draft: Draft<DirectionsQuestionnaireDraft>, resultPage: boolean) {
  let apiError = ValidationErrors.NO_ALTERNATIVE_COURT_NAME_SUMMARY
  try {
    if (resultPage) {
      const searchParam = form.model.searchParam
      const courts: Court[] = await Court.getCourtsByName(searchParam)
      if (courts) {
        let courtDetails: CourtDetails[] = []
        for (let court of courts) {
          courtDetails.push(await Court.getCourtDetails(court.slug))
        }
        const postcode: string = getDefaultPostcode(res)
        const nearestCourt: Court = await Court.getNearestCourt(postcode)
        let nearestCourtDetails: CourtDetails = undefined
        if (nearestCourt) {
          nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
        }
        renderPage(res, new Form<HearingLocation>(new HearingLocation(draft.document.hearingLocation.courtName,
          undefined, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted,
          draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
          form.model.alternativePostcode, form.model.alternativeCourtSelected, courtDetails, searchParam, nearestCourtDetails, true, AlternativeCourtOption.BY_NAME
        )), true, apiError)
      } else {
        renderPage(res, form, false, apiError)
      }
    } else {
      renderPage(res, form, resultPage, apiError)
    }
  } catch (err) {
    throw err
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      let apiError = ''
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft

      if (draft.document.hearingLocation.alternativeOption !== undefined
          && (draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_SEARCH
          || draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.NEAREST_COURT_SELECTED)) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.alternativeCourtName, draft.document.hearingLocation.alternativePostcode, draft.document.hearingLocation.facilities, YesNoOption.YES, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName, undefined
            )), false, apiError)
      } else {
        const postcode: string = getDefaultPostcode(res)
        const court: Court = await Court.getNearestCourt(postcode)
        if (court) {
          const courtDetails: CourtDetails = await Court.getCourtDetails(court.slug)
          renderPage(res,
            new Form<HearingLocation>(
              new HearingLocation(
                court.name, undefined, courtDetails.facilities, YesNoOption.YES
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
          try {
            const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
            draft.document.hearingLocation = form.model
            if (form.model.searchType === AlternativeCourtOption.BY_POSTCODE) {
              handlePostCodeSearchError(res, form, draft, true)
            } else if (form.model.searchType === AlternativeCourtOption.BY_NAME) {
              handleLocationSearchError(res, form, draft, true)
            } else {
              renderPage(res, form, false, undefined)
            }
          } catch (err) {
            next(err)
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
            postCodeSearch(res, form, draft, false)
          } else if (form.model.alternativeCourtSelected === 'no' && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            postCodeSearch(res, form, draft, true)
          } else if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            locationSearch(res, form, draft, false)
          } else if (form.model.alternativeCourtSelected === 'no' && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            locationSearch(res, form, draft, true)
          } else {
            if (form.model.alternativeOption !== undefined
                  && form.model.alternativeOption !== AlternativeCourtOption.BY_POSTCODE && form.model.alternativeOption !==
                  AlternativeCourtOption.BY_NAME) {
              const courtNames = Array.isArray(form.model.alternativeCourtName) ? form.model.alternativeCourtName [0] : form.model.alternativeCourtName
              if (courtNames) {
                const courtDetails: string[] = courtNames.split(':')
                draft.document.hearingLocation = form.model
                draft.document.hearingLocation.courtName = courtDetails[0]
                draft.document.hearingLocation.alternativeCourtName = courtDetails[0]
                draft.document.hearingLocation.alternativeOption = AlternativeCourtOption.NEAREST_COURT_SELECTED
                if (courtDetails.length === 2) {
                  draft.document.hearingLocationSlug = courtDetails[1]
                }

                const user: User = res.locals.user
                await new DraftService().save(draft, user.bearerToken)
              }
            } else if (form.model.alternativeCourtSelected !== undefined && form.model.alternativeCourtSelected !== 'no') {
              const courtNames = form.model.alternativeCourtSelected
              if (courtNames) {
                let courtDetail: CourtDetails = undefined
                if (form.model.alternativePostcode !== undefined && form.model.alternativePostcode !== '') {
                  const court: Court = await Court.getNearestCourt(form.model.alternativePostcode)
                  if (court) {
                    courtDetail = await Court.getCourtDetails(court.slug)
                  }
                } else if (form.model.alternativeCourtName !== undefined && form.model.alternativeCourtName !== '') {
                  const court: Court[] = await Court.getCourtsByName(form.model.alternativeCourtSelected)
                  if (court[0]) {
                    courtDetail = await Court.getCourtDetails(court[0].slug)
                  }
                }
                draft.document.hearingLocation = form.model
                draft.document.hearingLocation.courtName = courtDetail.name
                draft.document.hearingLocation.alternativeCourtName = courtDetail.name
                draft.document.hearingLocation.alternativeOption = AlternativeCourtOption.BY_SEARCH
                draft.document.hearingLocation.courtAccepted = YesNoOption.YES
                draft.document.hearingLocationSlug = courtDetail.slug
                draft.document.hearingLocation.facilities = courtDetail.facilities
              }

              const user: User = res.locals.user
              await new DraftService().save(draft, user.bearerToken)
            } else if (draft.document.hearingLocationSlug && !draft.document.hearingLocationSlug.length) {
              const postcode: string = getDefaultPostcode(res)
              const court: Court = await Court.getNearestCourt(postcode)
              if (court !== undefined) {
                draft.document.hearingLocationSlug = court.slug
              } else {
                draft.document.hearingLocationSlug = ''
              }
            } else {
              draft.document.hearingLocation.courtName = form.model.courtName
              draft.document.hearingLocation.courtAccepted = form.model.courtAccepted

              await new DraftService().save(draft, user.bearerToken)
            }
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } catch (err) {
          next(err)
        }
      }
    }))
