import * as express from 'express'
import * as config from 'config'
import { Paths } from 'first-contact/paths'
import { Paths as ResponsePaths } from 'response/paths'
import Claim from 'claims/models/claim'
import { buildURL } from 'utils/callbackBuilder'
import ClaimReferenceMatchesGuard from 'first-contact/guards/claimReferenceMatchesGuard'
import JwtExtractor from 'idam/jwtExtractor'

function receiverPath (req: express.Request, letterHolderId: number): string {
  const callbackPath = ResponsePaths.defendantLinkReceiver.evaluateUri({ letterHolderId: letterHolderId + '' })
  return `${config.get<string>('idam.authentication-web.url')}/login/uplift?jwt=${JwtExtractor.extract(req)}&continue-url=${buildURL(req, callbackPath)}`
}

export default express.Router()
  .get(Paths.claimSummaryPage.uri, ClaimReferenceMatchesGuard.requestHandler, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const claim: Claim = res.locals.user.claim
    res.render(Paths.claimSummaryPage.associatedView, { claim: claim })
  })
  .post(Paths.claimSummaryPage.uri, (req: express.Request, res: express.Response): void => {

    res.redirect(receiverPath(req, res.locals.user.id))
  })
