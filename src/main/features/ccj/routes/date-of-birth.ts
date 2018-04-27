import * as express from 'express'

import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { GuardFactory } from 'response/guards/guardFactory'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { PartyType } from 'common/partyType'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('ccj/guards/individualDateOfBirth')

const accessGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.claimData.defendant.type === PartyType.INDIVIDUAL.value
}, (req: express.Request, res: express.Response): void => {
  logger.warn(`CCJ state guard: defendant date of birth is only available for individual defendants - redirecting to dashboard page`)
  res.redirect(DashboardPaths.dashboardPage.uri)
})

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.dateOfBirthPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.dateOfBirthPage.uri,
    accessGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft
      renderView(new Form(draft.document.defendantDateOfBirth), res)
    })
  .post(
    Paths.dateOfBirthPage.uri,
    accessGuardRequestHandler,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftCCJ> = res.locals.ccjDraft
        const user: User = res.locals.user

        draft.document.defendantDateOfBirth = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.paidAmountPage.uri.replace(':externalId', externalId))
      }
    }))
