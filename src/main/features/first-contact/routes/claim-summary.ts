import * as express from 'express'
import { Paths } from 'first-contact/paths'
import { Claim } from 'claims/models/claim'
import { ClaimReferenceMatchesGuard } from 'first-contact/guards/claimReferenceMatchesGuard'
import { ClaimantRequestedCCJGuard } from 'first-contact/guards/claimantRequestedCCJGuard'
import { OAuthHelper } from 'idam/oAuthHelper'
import { getInterestDetails } from 'shared/interestUtils'

function receiverPath (req: express.Request, res: express.Response): string {
  return OAuthHelper.forUplift(req, res)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimSummaryPage.uri,
    ClaimReferenceMatchesGuard.requestHandler,
    ClaimantRequestedCCJGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const claim: Claim = res.locals.claim
      const interestData = await getInterestDetails(claim)
      res.render(Paths.claimSummaryPage.associatedView, {
        interestData: interestData
      })
    })
  .post(Paths.claimSummaryPage.uri, (req: express.Request, res: express.Response): void => {
    const redirectUrl = receiverPath(req, res)
    const doRedirect = () => {
      res.redirect(redirectUrl)
    }
    if (req.session) {
      req.session.destroy(() => {
        doRedirect()
      })
    } else {
      doRedirect()
    }
  })
