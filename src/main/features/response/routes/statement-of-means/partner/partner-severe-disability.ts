import { RoutablePath } from 'main/common/router/routablePath'
import { StatementOfMeansPaths } from 'response/paths'
import * as express from 'express'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'main/app/idam/user'
import { DraftService } from 'services/draftService'
import { PartnerSevereDisability } from 'response/form/models/statement-of-means/partnerSevereDisability'

const page: RoutablePath = StatementOfMeansPaths.partnerSevereDisabilityPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.partnerSevereDisability)
      })
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(PartnerSevereDisability),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartnerSevereDisability> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.partnerSevereDisability = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.dependantsPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
