import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { OtherDependants } from 'response/form/models/statement-of-means/otherDependants'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { DependantsDisabilityOption } from 'response/form/models/statement-of-means/dependantsDisability'
import { OtherDependantsDisabilityOption } from 'response/form/models/statement-of-means/otherDependantsDisability'
import { DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'
import { PartnerDisabilityOption } from 'response/form/models/statement-of-means/partnerDisability'
import { SevereDisabilityOption } from 'response/form/models/statement-of-means/severeDisability'

const page: RoutablePath = Paths.otherDependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.otherDependants)
      })
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(OtherDependants, OtherDependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<OtherDependants> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.otherDependants = form.model

        // skip if any dependants are disabled, or if defendant and partner are both disabled, or if defendant is severely disabled
        const anyDisabledDependants: boolean =
          (draft.document.statementOfMeans.dependantsDisability && draft.document.statementOfMeans.dependantsDisability.option === DependantsDisabilityOption.YES)
          || (draft.document.statementOfMeans.otherDependantsDisability && draft.document.statementOfMeans.otherDependantsDisability.option === OtherDependantsDisabilityOption.YES)
        const defendantIsDisabled: boolean = draft.document.statementOfMeans.disability.option === DisabilityOption.YES
        const partnerIsDisabled: boolean = draft.document.statementOfMeans.cohabiting.option === CohabitingOption.YES
          && draft.document.statementOfMeans.partnerDisability.option === PartnerDisabilityOption.YES
        const defendantIsSeverelyDisabled: boolean = draft.document.statementOfMeans.severeDisability
          && draft.document.statementOfMeans.severeDisability.option === SevereDisabilityOption.YES

        const skipCarerPage: boolean = anyDisabledDependants || (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled

        if (skipCarerPage) {
          draft.document.statementOfMeans.carer = undefined
        }

        await new DraftService().save(draft, user.bearerToken)
        if (skipCarerPage) {
          res.redirect(Paths.employmentPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.carerPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
