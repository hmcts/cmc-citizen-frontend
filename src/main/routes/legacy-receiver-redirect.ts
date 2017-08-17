import * as express from 'express'
import * as qs from 'qs'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'

function buildRedirectURL (baseURL: string, queryString?: string) {
  return baseURL + (queryString ? '?' + queryString : '')
}

export default express.Router()
  .get(AppPaths.legacyClaimantLoginReceiver.uri, (req: express.Request, res: express.Response) => {
    const queryString: string = qs.stringify(req.query)

    res.redirect(buildRedirectURL(ClaimPaths.claimantLoginReceiver.uri, queryString))
  })
