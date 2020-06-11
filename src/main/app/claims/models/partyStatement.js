"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offer_1 = require("claims/models/offer");
class PartyStatement {
    constructor(type, madeBy, offer) {
        this.type = type;
        this.madeBy = madeBy;
        this.offer = offer;
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            this.madeBy = input.madeBy;
            if (input.offer) {
                this.offer = new offer_1.Offer().deserialize(input.offer);
            }
        }
        return this;
    }
}
exports.PartyStatement = PartyStatement;
