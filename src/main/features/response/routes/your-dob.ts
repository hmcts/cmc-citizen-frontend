import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyType } from 'app/common/partyType'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import { IndividualDetails } from 'forms/models/individualDetails'
import User from 'idam/user'

function renderView (form: Form<DateOfBirth>, res: express.Response) {
  res.render(Paths.defendantDateOfBirthPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    switch (user.responseDraft.document.defendantDetails.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        renderView(new Form((user.responseDraft.document.defendantDetails.partyDetails as IndividualDetails).dateOfBirth), res)
        break
      default:
        res.redirect(Paths.defendantMobilePage.evaluateUri({ externalId: user.claim.externalId }))
        break
    }
  })
  .post(
    Paths.defendantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        switch (user.responseDraft.document.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            (user.responseDraft.document.defendantDetails.partyDetails as IndividualDetails).dateOfBirth = form.model
            break
          default:
            throw Error('Date of birth is only supported for defendant types individual and sole trader')
        }
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantMobilePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
