"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const statementOfMeansFeature_1 = require("response/helpers/statementOfMeansFeature");
const paths_1 = require("response/paths");
const uuidUtils_1 = require("shared/utils/uuidUtils");
class StatementOfMeansStateGuard {
    /**
     * Guard checks whether Statement of Means is required.
     * If so it accepts request, otherwise it makes redirect to task list
     *
     * @returns {e.RequestHandler}
     */
    static requestHandler(requireInitiatedModel = true) {
        return guardFactory_1.GuardFactory.create((res) => {
            const draft = res.locals.responseDraft;
            const claim = res.locals.claim;
            return statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, draft.document)
                && (requireInitiatedModel ? draft.document.statementOfMeans !== undefined : true);
        }, (req, res) => {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: uuidUtils_1.UUIDUtils.extractFrom(req.path) }));
        });
    }
}
exports.StatementOfMeansStateGuard = StatementOfMeansStateGuard;
