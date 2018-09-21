import { RoutablePath } from 'main/common/router/routablePath'
import { StatementOfMeansPaths } from 'response/paths'
import * as express from 'express'
import { OptInFeatureToggleGuard } from 'main/app/guards/optInFeatureToggleGuard'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'main/app/idam/user'
import { DraftService } from 'services/draftService'
import { OtherDependantsDisability } from 'response/form/models/statement-of-means/otherDependantsDisability'

const page: RoutablePath = StatementOfMeansPaths.otherDependantsDisabilityPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.otherDependantsDisability)
      })
    })
  .post(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(OtherDependantsDisability),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OtherDependantsDisability> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.otherDependantsDisability = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.carerPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
