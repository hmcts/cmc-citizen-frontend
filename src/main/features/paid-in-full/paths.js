"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
exports.paidInFullPath = '/case/:externalId/paid-in-full';
class Paths {
}
exports.Paths = Paths;
Paths.datePaidPage = new routablePath_1.RoutablePath(`${exports.paidInFullPath}/date-paid`);
Paths.confirmationPage = new routablePath_1.RoutablePath(`${exports.paidInFullPath}/confirmation`);
