import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { Form } from 'forms/form'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { Draft } from '@hmcts/draft-store-client'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { getUsersRole } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { MadeBy } from 'offer/form/models/madeBy'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

function renderPage (res: express.Response, form: Form<SupportRequired>) {
  res.render(Paths.supportPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.supportPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    renderPage(res, new Form<SupportRequired>(draft.document.supportRequired))
  })
  .post(Paths.supportPage.uri, FormValidator.requestHandler(SupportRequired, SupportRequired.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<SupportRequired> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user
        const claim: Claim = res.locals.claim
        draft.document.supportRequired = form.model

        await new DraftService().save(draft, user.bearerToken)

        if (getUsersRole(claim, user) === MadeBy.DEFENDANT) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))
