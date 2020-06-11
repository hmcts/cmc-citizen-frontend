"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const draftService_1 = require("services/draftService");
const store_1 = require("eligibility/store");
const paths_1 = require("eligibility/paths");
const eligibilityStore = new store_1.CookieEligibilityStore();
class ClaimEligibilityGuard {
    /**
     * Makes sure that eligibility check has passed prior accessing protected pages. The eligibility is assessed by
     * checking whether draft has been marked as eligible or whether eligible cookie exists. If none of the conditions
     * is met then user is redirected to eligibility index page, otherwise request is let through as is.
     *
     * @returns {express.RequestHandler} - request handler middleware
     */
    static requestHandler() {
        return guardFactory_1.GuardFactory.createAsync(async (req, res) => {
            const draft = res.locals.claimDraft;
            if (draft.document.eligibility) {
                return true;
            }
            const eligibility = eligibilityStore.read(req, res);
            if (eligibility.eligible) {
                await this.markDraftEligible(draft, res.locals.user);
                eligibilityStore.clear(req, res);
                return true;
            }
            return false;
        }, (req, res) => {
            res.redirect(paths_1.Paths.startPage.uri);
        });
    }
    static async markDraftEligible(draft, user) {
        draft.document.eligibility = true;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
    }
}
exports.ClaimEligibilityGuard = ClaimEligibilityGuard;
