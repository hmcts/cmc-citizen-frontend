"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offer_1 = require("claims/models/offer");
class OfferModelConverter {
    static convert(offerForm) {
        return new offer_1.Offer(offerForm.offerText, offerForm.completionDate.toMoment());
    }
}
exports.OfferModelConverter = OfferModelConverter;
