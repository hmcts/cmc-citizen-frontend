import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Form } from 'forms/form'
import { AlternativeCourtOption, HearingLocation } from 'directions-questionnaire/forms/models/hearingLocation'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Court } from 'court-finder-client/court'
import { CourtFinderClient } from 'court-finder-client/courtFinderClient'
import { Claim } from 'claims/models/claim'
import { CourtFinderResponse } from 'court-finder-client/courtFinderResponse'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseDraft } from 'response/draft/responseDraft'
import { MadeBy } from 'offer/form/models/madeBy'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { User } from 'idam/user'
import { PartyDetails } from 'forms/models/partyDetails'
import { CourtDetails } from 'court-finder-client/courtDetails'
import { CourtDetailsResponse } from 'court-finder-client/courtDetailsResponse'

function renderPage (res: express.Response, form: Form<HearingLocation>, fallbackPage: boolean) {
  res.render(Paths.hearingLocationPage.associatedView, { form: form, fallbackPage: fallbackPage, party: getUsersRole(res.locals.claim, res.locals.user) })
}

async function getNearestCourt (postcode: string): Promise<Court> {
  const courtFinderClient: CourtFinderClient = new CourtFinderClient()
  const response: CourtFinderResponse = await courtFinderClient.findMoneyClaimCourtsByPostcode(postcode)

  if (response.statusCode !== 200 || response.courts.length === 0) {
    return undefined
  } else {
    return response.courts[0]
  }
}

async function getCourtDetails (slug: string): Promise<CourtDetails> {
  const courtFinderClient: CourtFinderClient = new CourtFinderClient()
  const courtDetailsResponse: CourtDetailsResponse = await courtFinderClient.getCourtDetails(slug)

  return courtDetailsResponse.courtDetails
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
      //this is not right place - should be moved to tasklist builder
      draft.document.hearingLocation = undefined

      if (!draft.document.hearingLocation) {
        const postcode: string = getDefaultPostcode(res)
        const court: Court = await getNearestCourt(postcode)
        const courtDetails: CourtDetails = await getCourtDetails(court.slug)

        if (court) {
          renderPage(res,
            new Form<HearingLocation>(
              new HearingLocation(
                court.name, undefined, courtDetails.facilities
                )), false)
        } else {
          renderPage(res, new Form<HearingLocation>(new HearingLocation()), true)
        }

      } else {
        renderPage(res, new Form<HearingLocation>(
          new HearingLocation(draft.document.hearingLocation, undefined, undefined, YesNoOption.YES)),
          false)
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

          if (form.model.courtAccepted === YesNoOption.NO && form.model.alternativeOption === AlternativeCourtOption.BY_POSTCODE) {
            const court: Court = await getNearestCourt(form.model.alternativePostcode)
            if (court !== undefined) {
              const alternativeCourtDetails: CourtDetails = await getCourtDetails(court.slug)
              form.model = new HearingLocation(court.name, form.model.alternativePostcode, alternativeCourtDetails.facilities)
            }
            renderPage(res, form, court === undefined)

          } else {

            if (form.model.courtAccepted === undefined) {
              draft.document.hearingLocation = form.model.alternativeCourtName
            } else {
              draft.document.hearingLocation = form.model.courtName
            }

            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } catch (err) {
          next(err)
        }
      }
    }))
