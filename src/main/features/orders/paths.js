"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routablePath_1 = require("shared/router/routablePath");
const ordersPath = '/case/:externalId/orders';
class Paths {
}
exports.Paths = Paths;
Paths.disagreeReasonPage = new routablePath_1.RoutablePath(`${ordersPath}/disagree-with-order`);
Paths.confirmationPage = new routablePath_1.RoutablePath(`${ordersPath}/confirmation`);
Paths.reviewOrderReceiver = new routablePath_1.RoutablePath(`${ordersPath}/review-order-receipt`);
Paths.directionsOrderDocument = new routablePath_1.RoutablePath(`${ordersPath}/receipt`);
