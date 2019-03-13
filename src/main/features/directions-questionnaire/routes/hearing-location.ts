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

function renderPage (res: express.Response, form: Form<HearingLocation>, fallbackPage: boolean) {
  res.render(Paths.hearingLocationPage.associatedView, { form: form, fallbackPage: fallbackPage, defendantView: isPartyDefendant(res) })
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

function isPartyDefendant (res: express.Response): boolean {
  return (!res.locals.claim.response)
}

function getDefaultPostcode (res: express.Response): string {
  const claim: Claim = res.locals.claim
  if (isPartyDefendant(res)) {
    const responseDraft: Draft<ResponseDraft> = res.locals.responseDraft
    if (responseDraft.document.defendantDetails.partyDetails) {
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
      let form: Form<HearingLocation> = new Form<HearingLocation>(new HearingLocation())

      if (!draft.document.hearingLocation) {
        const court: Court = await getNearestCourt(getDefaultPostcode(res))
        if (court) {
          form.model.courtName = court.name
          form.model.courtPostcode = getDefaultPostcode(res)
        }
        renderPage(res, form, court === undefined)
      } else {
        form.model.courtName = draft.document.hearingLocation
        form.model.courtAccepted = YesNoOption.YES
        form.model.courtPostcode = draft.document.hearingLocationPostcode
        renderPage(res, form, false)
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
              form.model = new HearingLocation(undefined, court.name, form.model.alternativePostcode)
            }
            renderPage(res, form, court === undefined)
          } else {
            if (form.model.courtAccepted === YesNoOption.NO) {
              draft.document.hearingLocation = form.model.alternativeCourtName
            } else {
              draft.document.hearingLocation = form.model.courtName
            }
            draft.document.hearingLocationPostcode = form.model.courtPostcode

            await new DraftService().save(draft, user.bearerToken)
            res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }))
          }
        } catch (err) {
          next(err)
        }
      }
    }))
