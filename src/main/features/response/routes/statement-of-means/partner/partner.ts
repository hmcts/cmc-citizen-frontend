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
import { Cohabiting } from 'response/form/models/statement-of-means/cohabiting'
import { YesNoOption } from 'main/app/claims/models/response/core/yesNoOption'

const page: RoutablePath = StatementOfMeansPaths.partnerPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.cohabiting)
      })
    })
  .post(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Cohabiting, Cohabiting.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Cohabiting> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.cohabiting = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option.option === YesNoOption.YES) {
          res.redirect(StatementOfMeansPaths.partnerAgePage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(StatementOfMeansPaths.dependantsPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
