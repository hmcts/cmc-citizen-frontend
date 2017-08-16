import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Name } from 'app/forms/models/name'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'

import { ObjectUtils } from 'app/utils/objectUtils'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'

async function getNameProvidedByClaimant (defendantId: number): Promise<string> {
  const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(defendantId)
  return claim.claimData.defendant.name
}

function renderView (form: Form<Name>, res: express.Response) {
  res.render(Paths.defendantYourDetailsPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantYourDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      const nameProvidedByDefendant = user.responseDraft.defendantDetails.name
      const nameProvidedByClaimant = await getNameProvidedByClaimant(user.id)
      renderView(new Form(ObjectUtils.defaultWhenUndefined(nameProvidedByDefendant, new Name(nameProvidedByClaimant))), res)
    } catch (err) {
      next(err)
    }
  })
  .post(
    Paths.defendantYourDetailsPage.uri,
    FormValidator.requestHandler(Name),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Name> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.defendantDetails.name = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantAddressPage.uri)
      }
    }))
