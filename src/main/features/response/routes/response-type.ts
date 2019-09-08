import * as express from 'express'
import { PartAdmissionPaths, Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FullAdmission, PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { FeatureToggles } from 'utils/featureToggles'
import { MediationDraft } from 'mediation/draft/mediationDraft'

function renderView (form: Form<Response>, res: express.Response) {
  const claim: Claim = res.locals.claim
  res.render(Paths.responseTypePage.associatedView, {
    form: form,
    responseDeadline: claim.responseDeadline
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.responseTypePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.response), res)
    }))
  .post(
    Paths.responseTypePage.uri,
    FormValidator.requestHandler(Response, Response.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<Response> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        draft.document.response = form.model

        if (draft.document.response.type === ResponseType.FULL_ADMISSION) {
          if (!draft.document.fullAdmission) {
            draft.document.fullAdmission = new FullAdmission()
          }
          delete draft.document.partialAdmission
          delete draft.document.freeMediation
          if (mediationDraft && mediationDraft.id) {
            await new DraftService().delete(mediationDraft.id, user.bearerToken)
          }
        } else if (draft.document.response.type === ResponseType.PART_ADMISSION) {
          if (!draft.document.partialAdmission) {
            draft.document.partialAdmission = new PartialAdmission()
          }
          delete draft.document.fullAdmission
          delete draft.document.rejectAllOfClaim
          delete draft.document.freeMediation
        } else {
          delete draft.document.fullAdmission
          delete draft.document.partialAdmission
          delete draft.document.statementOfMeans
        }

        await new DraftService().save(draft, user.bearerToken)

        switch (draft.document.response.type) {
          case ResponseType.DEFENCE:
            res.redirect(Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: externalId }))
            break

          case ResponseType.PART_ADMISSION:
            if (FeatureToggles.hasAnyAuthorisedFeature(claim.features, 'admissions')) {
              res.redirect(PartAdmissionPaths.alreadyPaidPage.evaluateUri({ externalId: externalId }))
            } else {
              res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
            }
            break

          case ResponseType.FULL_ADMISSION:
            if (FeatureToggles.hasAnyAuthorisedFeature(claim.features, 'admissions')) {
              res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
            } else {
              res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
            }
            break

          default:
            next(new Error(`Unknown response type: ${draft.document.response.type}`))
        }
      }
    }))
