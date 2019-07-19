/* tslint:disable:no-default-export */
import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Draft } from '@hmcts/draft-store-client'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'models/yesNoOption'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

function renderPage (res: express.Response, form: Form<ExpertEvidence>) {
  res.render(Paths.expertEvidencePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.expertEvidencePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
    renderPage(res, new Form<ExpertEvidence>(draft.document.expertEvidence))
  })

  .post(Paths.expertEvidencePage.uri,
    FormValidator.requestHandler(ExpertEvidence, ExpertEvidence.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ExpertEvidence> = req.body

      if (form.hasErrors()) {
        renderPage(res, form)
      } else {
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        if (form.model.expertEvidence.option === YesNoOption.NO.option && draft.document.expertEvidence && draft.document.expertEvidence.expertEvidence && draft.document.expertEvidence.expertEvidence.option === YesNoOption.YES.option) {
          draft.document.whyExpertIsNeeded = new WhyExpertIsNeeded()
        }

        draft.document.expertEvidence = form.model

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.expertEvidence.option === YesNoOption.YES.option) {
          res.redirect(Paths.whyExpertIsNeededPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    })
  )
