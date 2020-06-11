"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const madeBy_1 = require("claims/models/madeBy");
const statementType_1 = require("offer/form/models/statementType");
exports.offer = {
    type: statementType_1.StatementType.OFFER.value,
    madeBy: madeBy_1.MadeBy.DEFENDANT.value,
    offer: {
        content: 'Offer',
        completionDate: '2018-01-01'
    }
};
exports.offerRejection = {
    type: statementType_1.StatementType.REJECTION.value,
    madeBy: madeBy_1.MadeBy.DEFENDANT.value
};
