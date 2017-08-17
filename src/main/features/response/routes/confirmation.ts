import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { DefendantResponse } from 'app/claims/models/defendantResponse'
import { buildURL } from 'app/utils/CallbackBuilder'

export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user: User = res.locals.user

      const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(user.id)
      const response: DefendantResponse = await ClaimStoreClient.retrieveResponse(user.id, claim.id)

      const viewModel: object = {
        submittedOn: response.respondedAt,
        claimantName: claim.claimData.claimant.name,
        defendantEmail: user.email,
        responseDashboardUrl: buildURL(req, 'response/dashboard')
      }

      res.render(Paths.confirmationPage.associatedView, { viewModel: viewModel })
    } catch (err) {
      next(err)
    }
  })
