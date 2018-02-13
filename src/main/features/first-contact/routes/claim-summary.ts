import * as express from 'express'
import * as config from 'config'
import * as Cookies from 'cookies'
import { Paths } from 'first-contact/paths'
import { Claim } from 'claims/models/claim'
import { ClaimReferenceMatchesGuard } from 'first-contact/guards/claimReferenceMatchesGuard'
import { JwtExtractor } from 'idam/jwtExtractor'
import { ClaimantRequestedCCJGuard } from 'first-contact/guards/claimantRequestedCCJGuard'
import { OAuthHelper } from 'idam/oAuthHelper'

const sessionCookie = config.get<string>('session.cookieName')

function receiverPath (req: express.Request, res: express.Response): string {
  return `${OAuthHelper.forUplift(req, res)}&jwt=${JwtExtractor.extract(req)}`
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimSummaryPage.uri,
    ClaimReferenceMatchesGuard.requestHandler,
    ClaimantRequestedCCJGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const claim: Claim = res.locals.claim
      res.render(Paths.claimSummaryPage.associatedView, { claim: claim })
    })
  .post(Paths.claimSummaryPage.uri, (req: express.Request, res: express.Response): void => {
    new Cookies(req, res).set(sessionCookie, '', { sameSite: 'lax' })
    res.redirect(receiverPath(req, res))
  })
