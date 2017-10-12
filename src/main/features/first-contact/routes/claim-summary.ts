import * as express from 'express'
import { Paths } from 'first-contact/paths'
import Claim from 'claims/models/claim'
import ClaimReferenceMatchesGuard from 'first-contact/guards/claimReferenceMatchesGuard'
import JwtExtractor from 'idam/jwtExtractor'
import { RedirectHelper } from 'utils/redirectHelper'

function receiverPath (req: express.Request, res: express.Response): string {
  return `${RedirectHelper.getRedirectUriForUplift(req, res)}&jwt=${JwtExtractor.extract(req)}`
}

export default express.Router()
  .get(Paths.claimSummaryPage.uri, ClaimReferenceMatchesGuard.requestHandler, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const claim: Claim = res.locals.user.claim
    res.render(Paths.claimSummaryPage.associatedView, { claim: claim })
  })
  .post(Paths.claimSummaryPage.uri, (req: express.Request, res: express.Response): void => {
    res.redirect(receiverPath(req, res))
  })
