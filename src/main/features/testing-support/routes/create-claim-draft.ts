import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DraftClaim } from 'drafts/models/draftClaim'
import { prepareClaimDraft } from 'drafts/draft-data/claimDraft'
import { Draft } from '@hmcts/draft-store-client'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.createClaimDraftPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.createClaimDraftPage.associatedView)
    })
  )
  .post(Paths.createClaimDraftPage.uri,
    DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      const user: User = res.locals.user

      draft.document = new DraftClaim().deserialize(prepareClaimDraft(user.email, await featureToggles.isHelpWithFeesEnabled()))
      await new DraftService().save(draft, user.bearerToken)

      res.redirect(ClaimPaths.checkAndSendPage.uri)
    })
  )
