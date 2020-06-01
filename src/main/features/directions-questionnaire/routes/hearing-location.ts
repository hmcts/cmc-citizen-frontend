import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { AlternativeCourtOption, HearingLocation } from 'directions-questionnaire/forms/models/hearingLocation'
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

function renderPage (res: express.Response, form: Form<HearingLocation>, fallbackPage: boolean) {
  res.render(Paths.hearingLocationPage.associatedView, {
    form: form,
    fallbackPage: fallbackPage,
    party: getUsersRole(res.locals.claim, res.locals.user)
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
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft

      if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.courtName, draft.document.hearingLocation.alternativePostcode, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted
            )), false)
      } else if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === AlternativeCourtOption.BY_NAME) {
        renderPage(res,
          new Form<HearingLocation>(
            new HearingLocation(
              draft.document.hearingLocation.courtName, undefined, undefined, draft.document.hearingLocation.courtAccepted, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName
            )), false)
      } else {
        const postcode: string = getDefaultPostcode(res)
        const court: Court = await Court.getNearestCourt(postcode)
        if (court) {
          const courtDetails: CourtDetails = await Court.getCourtDetails(court.slug)
          renderPage(res,
            new Form<HearingLocation>(
              new HearingLocation(
                court.name, undefined, courtDetails.facilities, draft.document.hearingLocation.courtAccepted
              )), false)
        } else {
          renderPage(res, new Form<HearingLocation>(new HearingLocation()), true)
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
        renderPage(res, form, false)
      } else {
        try {
          const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
          const user: User = res.locals.user
          draft.document.hearingLocation = form.model

          if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            const court: Court = await Court.getNearestCourt(form.model.alternativePostcode)
            if (court !== undefined) {
              const alternativeCourtDetails: CourtDetails = await Court.getCourtDetails(court.slug)
              draft.document.hearingLocation.alternativeCourtName = court.name
              draft.document.hearingLocation.alternativePostcode = form.model.alternativePostcode
              draft.document.hearingLocation.alternativeOption = form.model.alternativeOption
              draft.document.hearingLocation.facilities = alternativeCourtDetails.facilities
              draft.document.hearingLocationSlug = court.slug
              form.model = new HearingLocation(court.name, form.model.alternativePostcode, alternativeCourtDetails.facilities)
            }
            await new DraftService().save(draft, user.bearerToken)
            renderPage(res, form, court === undefined)
          } else if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
            draft.document.hearingLocation = form.model
            draft.document.hearingLocation.alternativeOption = form.model.alternativeOption
            draft.document.hearingLocation.courtName = form.model.alternativeCourtName
            draft.document.hearingLocationSlug = ''

            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          } else if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_SEARCH) {
            console.log(Paths.hearingLocationResultPage.evaluateUri({ externalId: res.locals.claim.externalId } ) + `?name=${form.model.alternativeCourtName}`)
            res.redirect(Paths.hearingLocationResultPage.evaluateUri({ externalId: res.locals.claim.externalId } ) + `?name=${form.model.alternativeCourtName}`)
          } else {
            if (form.model.alternativeOption !== undefined && form.model.alternativeOption === AlternativeCourtOption.BY_NAME) {
              draft.document.hearingLocation.alternativeCourtName = ''
              draft.document.hearingLocation.alternativeOption = undefined
            } else if (draft.document.hearingLocationSlug && !draft.document.hearingLocationSlug.length) {
              const postcode: string = getDefaultPostcode(res)
              const court: Court = await Court.getNearestCourt(postcode)
              if (court !== undefined) {
                draft.document.hearingLocationSlug = court.slug
              } else {
                draft.document.hearingLocationSlug = ''
              }
            }
            draft.document.hearingLocation.courtName = form.model.courtName
            draft.document.hearingLocation.courtAccepted = form.model.courtAccepted

            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } catch (err) {
          next(err)
        }
      }
    }))
