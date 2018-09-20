import { RoutablePath } from 'shared/router/routablePath'
import { StatementOfMeansPaths } from 'response/paths'
import * as express from 'express'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { PartnerSevereDisability } from 'response/form/models/statement-of-means/partnerSevereDisability'

const page: RoutablePath = StatementOfMeansPaths.partnerSevereDisabilityPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.partnerSevereDisability)
      })
    })
  .post(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(PartnerSevereDisability, PartnerSevereDisability.fromObject),
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
