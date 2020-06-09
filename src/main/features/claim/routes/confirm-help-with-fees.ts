import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { noRetryRequest } from 'client/request'
import { User } from 'idam/user'
import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { DraftService } from 'services/draftService'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(noRetryRequest)
const launchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
const featuresBuilder: FeaturesBuilder = new FeaturesBuilder(claimStoreClient, launchDarklyClient)

function renderView (res: express.Response): void {
  const draft: Draft<DraftClaim> = res.locals.claimDraft

  res.render(Paths.confirmHelpWithFeesPage.associatedView, {
    helpWithFeesNumber: draft.document.paymentMethod.helpWithFeesNumber,
    editPage: Paths.paymentMethodPage.uri
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmHelpWithFeesPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.confirmHelpWithFeesPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      console.log(`WIBBLE! draft = ${JSON.stringify(draft)}`)
      const user: User = res.locals.user
      const features = await featuresBuilder.features(draft.document.amount.totalAmount(), user)

      await claimStoreClient.saveClaim(draft, user, features)
      await new DraftService().delete(draft.id, user.bearerToken)

      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: draft.document.externalId }))
    }))
