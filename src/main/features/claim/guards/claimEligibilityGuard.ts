import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'

import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'

import { CookieEligibilityStore } from 'eligibility/store'

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
  static requestHandler (): express.RequestHandler {
    return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      if (draft.document.eligibility) {
        return true
      }

      const eligibility = eligibilityStore.read(req, res)
      if (eligibility.eligible) {
        await this.markDraftEligible(draft, res.locals.user)
        eligibilityStore.clear(req, res)
        return true
      }

      return false
    }, (req: express.Request, res: express.Response): void => {
      res.redirect(EligibilityPaths.startPage.uri)
    })
  }

  private static async markDraftEligible (draft: Draft<DraftClaim>, user: User) {
    draft.document.eligibility = true
    await new DraftService().save(draft, user.bearerToken)
  }
}
