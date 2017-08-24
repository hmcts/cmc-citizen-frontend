import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyType } from 'forms/models/partyType'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'

function renderView (form: Form<DateOfBirth>, res: express.Response) {
  res.render(Paths.defendantDateOfBirthPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    switch (res.locals.user.responseDraft.defendantDetails.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        renderView(new Form((res.locals.user.responseDraft.defendantDetails.partyDetails as IndividualDetails).dateOfBirth), res)
        break
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        renderView(new Form((res.locals.user.responseDraft.defendantDetails.partyDetails as SoleTraderDetails).dateOfBirth), res)
        break
      default:
        renderView(Form.empty<DateOfBirth>(), res)
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
        switch (res.locals.user.responseDraft.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            (res.locals.user.responseDraft.defendantDetails.partyDetails as IndividualDetails).dateOfBirth = form.model
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            (res.locals.user.responseDraft.defendantDetails.partyDetails as SoleTraderDetails).dateOfBirth = form.model
            break
          default:
            throw Error('Date of birth is only supported for defendant types individual and sole trader')
        }
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantMobilePage.uri)
      }
    }))
