import * as express from 'express'
import { Paths } from 'settlement-agreement/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { DefendantSettlementResponse } from 'settlement-agreement/form/models/defendantSettlementResponse'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { User } from 'main/app/idam/user'
import { YesNoOption } from 'main/app/models/yesNoOption'
import { SettlementAgreementClient } from 'main/app/claims/settlementAgreementClient'

const settlementAgreementClient: SettlementAgreementClient = new SettlementAgreementClient()

async function renderView (form: Form<DefendantSettlementResponse>, res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = res.locals.claim
    res.render(Paths.signSettlementAgreement.associatedView, {
      form: form,
      claim: claim,
      offer: claim.settlement.getLastOffer(),
      name: 'option'
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.signSettlementAgreement.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(new DefendantSettlementResponse()), res, next)
    }))
  .post(
    Paths.signSettlementAgreement.uri,
    FormValidator.requestHandler(DefendantSettlementResponse),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantSettlementResponse> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user

        if (form.model.option === YesNoOption.YES.option) {
          await settlementAgreementClient.countersignSettlementAgreement(claim.externalId, user)
        } else {
          await settlementAgreementClient.rejectSettlementAgreement(claim.externalId, user)
        }
        res.redirect(Paths.settlementAgreementConfirmation.evaluateUri({ externalId: claim.externalId }))
      }
    }
    ))
