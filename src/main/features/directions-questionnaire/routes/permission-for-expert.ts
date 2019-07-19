import * as express from 'express'
import { Paths } from 'features/directions-questionnaire/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { PermissionForExpert } from 'directions-questionnaire/forms/models/permissionForExpert'
import { YesNoOption } from 'models/yesNoOption'
import { FormValidator } from 'forms/validation/formValidator'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

function renderPage (res: express.Response, form: Form<PermissionForExpert>) {
  res.render(Paths.permissionForExpertPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.permissionForExpertPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderPage(res, new Form<PermissionForExpert>(draft.document.permissionForExpert))
    })
  .post(
    Paths.permissionForExpertPage.uri,
    FormValidator.requestHandler(PermissionForExpert, PermissionForExpert.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PermissionForExpert> = req.body

      if (form.hasErrors()) {
        res.render(Paths.permissionForExpertPage.associatedView, {
          form: form
        })
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        if (form.model.option.option === YesNoOption.NO.option && draft.document.permissionForExpert && draft.document.permissionForExpert.option && draft.document.permissionForExpert.option.option === YesNoOption.YES.option) {
          draft.document.expertEvidence = new ExpertEvidence()
          draft.document.whyExpertIsNeeded = new WhyExpertIsNeeded()
        }
        draft.document.permissionForExpert = form.model

        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.permissionForExpert.option.option === YesNoOption.YES.option) {
          res.redirect(Paths.expertEvidencePage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    })
  )
