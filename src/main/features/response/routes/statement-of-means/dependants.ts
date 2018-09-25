import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'
import { DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { SevereDisabilityOption } from 'response/form/models/statement-of-means/severeDisability'
import { CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'
import { PartnerDisabilityOption } from 'response/form/models/statement-of-means/partnerDisability'

const page: RoutablePath = Paths.dependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.dependants) })
    })
  .post(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Dependants, Dependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Dependants> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.dependants = form.model
        if (!form.model.numberOfChildren || !form.model.numberOfChildren.between16and19) {
          draft.document.statementOfMeans.education = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.numberOfChildren && form.model.numberOfChildren.between16and19) {
          res.redirect(Paths.educationPage.evaluateUri({ externalId: externalId }))
        } else {
          // skip if defendant and partner are both disabled, or if defendant is severely disabled
          const defendantIsDisabled: boolean = draft.document.statementOfMeans.disability.option === DisabilityOption.YES
          const defendantIsSeverelyDisabled: boolean = draft.document.statementOfMeans.severeDisability
            && draft.document.statementOfMeans.severeDisability.option === SevereDisabilityOption.YES
          const partnerIsDisabled: boolean = draft.document.statementOfMeans.cohabiting.option === CohabitingOption.YES
            && draft.document.statementOfMeans.partnerDisability.option === PartnerDisabilityOption.YES

          // also skip if there aren't any children
          const hasChildren: boolean = form.model.numberOfChildren
            ? (form.model.numberOfChildren.under11 + form.model.numberOfChildren.between11and15 + form.model.numberOfChildren.between16and19) > 0
            : false

          const skipDisabilityQuestion: boolean = !hasChildren || (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled

          if (skipDisabilityQuestion) {
            res.redirect(Paths.otherDependantsPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(Paths.dependantsDisabilityPage.evaluateUri({ externalId: externalId }))
          }
        }
      }
    })
  )
