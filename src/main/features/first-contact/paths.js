"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
class Paths {
}
exports.Paths = Paths;
Paths.startPage = new routablePath_1.RoutablePath('/first-contact/start');
Paths.claimReferencePage = new routablePath_1.RoutablePath('/first-contact/claim-reference');
Paths.claimSummaryPage = new routablePath_1.RoutablePath('/first-contact/claim-summary');
Paths.receiptReceiver = new routablePath_1.RoutablePath('/first-contact/claim/receipt');
class ErrorPaths {
}
exports.ErrorPaths = ErrorPaths;
ErrorPaths.claimSummaryAccessDeniedPage = new routablePath_1.RoutablePath('/first-contact/access-denied');
ErrorPaths.ccjRequestedHandoffPage = new routablePath_1.RoutablePath('/first-contact/claimant-has-requested-ccj');
