import * as express from 'express'

import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { GuardFactory } from 'response/guards/guardFactory'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import User from 'app/idam/user'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyType } from 'app/common/partyType'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/DraftService'

const logger = require('@hmcts/nodejs-logging').getLogger('ccj/guards/individualDateOfBirth')

const accessGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  return res.locals.user.claim.claimData.defendant.type === PartyType.INDIVIDUAL.value
}, (req: express.Request, res: express.Response): void => {
  logger.warn(`CCJ state guard: defendant date of birth is only available for individual defendants - redirecting to dashboard page`)
  res.redirect(DashboardPaths.dashboardPage.uri)
})

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.dateOfBirthPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.dateOfBirthPage.uri,
    accessGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.ccjDraft.document.defendantDateOfBirth), res)
    })
  .post(
    Paths.dateOfBirthPage.uri,
    accessGuardRequestHandler,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.ccjDraft.document.defendantDateOfBirth = form.model
        await new DraftService().save(user.ccjDraft, user.bearerToken)
        res.redirect(Paths.paidAmountPage.uri.replace(':externalId', externalId))

      }
    }))
