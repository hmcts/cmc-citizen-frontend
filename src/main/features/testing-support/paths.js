"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
class Paths {
}
exports.Paths = Paths;
Paths.indexPage = new routablePath_1.RoutablePath('/testing-support/index');
Paths.updateResponseDeadlinePage = new routablePath_1.RoutablePath('/testing-support/update-response-deadline');
Paths.deleteDraftsPage = new routablePath_1.RoutablePath('/testing-support/delete-drafts');
Paths.createClaimDraftPage = new routablePath_1.RoutablePath('/testing-support/create-claim-draft');
