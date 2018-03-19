import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { CookieEligibilityStore } from 'eligibility/store'
import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'

import { Paths as EligibilityPaths } from 'eligibility/paths'

const eligibilityStore = new CookieEligibilityStore()

export class ClaimEligibilityGuard {
  /**
   * Makes sure that eligibility check has passed prior accessing protected pages. The eligibility is assessed by
   * checking whether draft has been marked as eligible or whether eligible cookie exists. If none of the conditions
   * is met then user is redirected to eligibility index page, otherwise request is let through as is.
   *
   * @returns {express.RequestHandler} - request handler middleware
   */
  static check (): express.RequestHandler {
    return GuardFactory.create((res: express.Response, req: express.Request) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      if (draft.document.eligibility) {
        return true
      }

      const eligibility = eligibilityStore.read(req, res)
      if (eligibility.eligible) {
        draft.document.eligibility = true
        return true
      }

      return false
    }, (req: express.Request, res: express.Response): void => {
      res.redirect(EligibilityPaths.startPage.uri)
    })
  }
}
