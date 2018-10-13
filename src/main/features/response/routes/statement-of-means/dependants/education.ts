import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { Education } from 'response/form/models/statement-of-means/education'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { UUIDUtils } from 'shared/utils/uuidUtils'
import { DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { SevereDisabilityOption } from 'response/form/models/statement-of-means/severeDisability'
import { CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'
import { PartnerDisabilityOption } from 'response/form/models/statement-of-means/partnerDisability'

const page: RoutablePath = Paths.educationPage

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.statementOfMeans.dependants !== undefined
    && draft.document.statementOfMeans.dependants.declared === true
    && draft.document.statementOfMeans.dependants.numberOfChildren.between16and19 > 0
}, (req: express.Request, res: express.Response): void => {
  res.redirect(Paths.dependantsPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
})

function renderView (form: Form<Education>, res: express.Response): void {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const numberOfChildren: NumberOfChildren = draft.document.statementOfMeans.dependants.numberOfChildren
  res.render(page.associatedView, {
    form: form,
    numberOfChildrenBetween16and19: (numberOfChildren && numberOfChildren.between16and19) || 0
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.education), res)
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    stateGuardRequestHandler,
    FormValidator.requestHandler(Education, Education.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Education> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.education = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params

        // skip if defendant and partner are both disabled, or if defendant is severely disabled
        const defendantIsDisabled: boolean = draft.document.statementOfMeans.disability.option === DisabilityOption.YES
        const defendantIsSeverelyDisabled: boolean = draft.document.statementOfMeans.severeDisability
          && draft.document.statementOfMeans.severeDisability.option === SevereDisabilityOption.YES
        const partnerIsDisabled: boolean = draft.document.statementOfMeans.cohabiting.option === CohabitingOption.YES
          && draft.document.statementOfMeans.partnerDisability.option === PartnerDisabilityOption.YES

        const skipDisabilityQuestion: boolean = (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled

        if (skipDisabilityQuestion) {
          res.redirect(Paths.otherDependantsPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.dependantsDisabilityPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
