import * as express from 'express'
import { Paths } from 'features/directions-questionnaire/paths'

import { Paths as DashboardPaths } from 'features/dashboard/paths'
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

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.permissionForExpertPage.uri,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      res.render(Paths.permissionForExpertPage.associatedView, {
        form: new Form<PermissionForExpert>(draft.document.permissionForExpert) })
    })
  .post(
    Paths.permissionForExpertPage.uri,
    FormValidator.requestHandler(PermissionForExpert, PermissionForExpert.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PermissionForExpert> = req.body

      if (form.hasErrors()) {
        res.render(Paths.permissionForExpertPage.associatedView, {
          form: form })
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        draft.document.permissionForExpert = form.model

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.requestPermissionForExpert.option === YesNoOption.YES.option) {
          res.redirect(DashboardPaths.dashboardPage.uri)
        } else {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    })
  )
