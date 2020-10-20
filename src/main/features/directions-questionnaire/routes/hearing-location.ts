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

function renderPage (res: express.Response, form: Form<HearingLocation>, resultPage: boolean,
                    courts: CourtDetails[], nearestCourt: CourtDetails, searchString: string, apiError: string) {
  res.render(Paths.hearingLocationPage.associatedView, {
    form: form,
    resultPage: resultPage,
    party: getUsersRole(res.locals.claim, res.locals.user),
    courts: courts,
    nearestCourt: nearestCourt,
    searchString: searchString,
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

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      let apiError = ''
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft

      if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.courtName, draft.document.hearingLocation.alternativePostcode, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted
            )), false, [], undefined, undefined, apiError)
      } else if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_NAME) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.alternativeCourtName, undefined, undefined, undefined, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName
            )), false, [], undefined, undefined, apiError)
      } else {
        const postcode: string = getDefaultPostcode(res)
        const court: Court = await Court.getNearestCourt(postcode)
        if (court) {
          const courtDetails: CourtDetails = await Court.getCourtDetails(court.slug)
          renderPage(res,
            new Form<HearingLocation>(
              new HearingLocation(
                court.name, undefined, courtDetails.facilities, draft.document.hearingLocation.courtAccepted
              )), false, [], undefined, undefined, apiError)
        } else {
          renderPage(res, new Form<HearingLocation>(new HearingLocation()), true, [], undefined, undefined, apiError)
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
        renderPage(res, form, false, [], undefined, undefined, undefined)
      } else {
        try {
          let apiError = ''
          const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
          const user: User = res.locals.user
          draft.document.hearingLocation = form.model

          if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            const postcode: string = getDefaultPostcode(res)
            const nearestCourt: Court = await Court.getNearestCourt(postcode)
            let nearestCourtDetails: CourtDetails = undefined
            if (nearestCourt) {
              nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
            }
            const searchParam = form.model.alternativePostcode
            const court: Court = await Court.getNearestCourt(searchParam)
            if (court !== undefined) {
              let courtDetails: CourtDetails[] = []
              courtDetails.push(await Court.getCourtDetails(court.slug))
              renderPage(res, new Form<HearingLocation>(new HearingLocation()), true, courtDetails, nearestCourtDetails, searchParam, apiError)
            } else {
              apiError = ValidationErrors.NO_ALTERNATIVE_POSTCODE
              renderPage(res, new Form<HearingLocation>(new HearingLocation(
                draft.document.hearingLocation.courtName, undefined, undefined, undefined, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
                draft.document.hearingLocation.alternativePostcode)), false, [], nearestCourtDetails, searchParam, apiError)
            }
          } else if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            const postcode: string = getDefaultPostcode(res)
            const nearestCourt: Court = await Court.getNearestCourt(postcode)
            let nearestCourtDetails: CourtDetails = undefined
            if (nearestCourt) {
              nearestCourtDetails = await Court.getCourtDetails(nearestCourt.slug)
            }
            const searchParam = form.model.alternativeCourtName
            const courts: Court[] = await Court.getCourtsByName(searchParam)
            if (courts) {
              let courtDetails: CourtDetails[] = []
              for (let court of courts) {
                courtDetails.push(await Court.getCourtDetails(court.slug))
              }
              renderPage(res, new Form<HearingLocation>(new HearingLocation()), true, courtDetails, nearestCourtDetails, searchParam, apiError)
            } else {
              apiError = ValidationErrors.NO_ALTERNATIVE_COURT_NAME
              renderPage(res, new Form<HearingLocation>(
                new HearingLocation(
                  draft.document.hearingLocation.courtName, undefined, undefined, undefined, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName,
                  draft.document.hearingLocation.alternativePostcode)), false, [], nearestCourtDetails, searchParam, apiError)
            }
          } else {
            if (form.model.alternativeOption !== undefined && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
              const courtNames = Array.isArray(form.model.alternativeCourtName) ? form.model.alternativeCourtName [0] : form.model.alternativeCourtName
              if (courtNames) {
                const courtDetails: string[] = courtNames.split(':')
                draft.document.hearingLocation = form.model
                draft.document.hearingLocation.alternativeCourtName = courtDetails[0]
                if (courtDetails.length === 2) {
                  draft.document.hearingLocationSlug = courtDetails[1]
                }

                const user: User = res.locals.user
                await new DraftService().save(draft, user.bearerToken)
              }
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
