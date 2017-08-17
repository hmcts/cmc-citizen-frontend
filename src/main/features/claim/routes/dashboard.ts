import * as express from 'express'

import { Paths } from 'claim/paths'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

export default express.Router()
  .get(Paths.dashboardPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      const claims: Claim[] = await ClaimStoreClient.retrieveByClaimantId(res.locals.user.id)
      const draftSaved: boolean = res.locals.user.claimDraft.lastUpdateTimestamp !== undefined

      if (claims.length === 0) {
        if (draftSaved) {
          return res.redirect(Paths.taskListPage.uri)
        } else {
          return res.redirect(Paths.startPage.uri)
        }
      }

      res.render(Paths.dashboardPage.associatedView, {
        paths: Paths,
        claims: claims,
        draftSaved: draftSaved
      })
    } catch (err) {
      next(err)
    }
  })
