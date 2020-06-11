"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const madeBy_1 = require("claims/models/madeBy");
function getPreferredParty(claim) {
    const isDefendantBusiness = claim.claimData.defendant.isBusiness();
    if (isDefendantBusiness) {
        return madeBy_1.MadeBy.CLAIMANT;
    }
    else {
        return madeBy_1.MadeBy.DEFENDANT;
    }
}
exports.getPreferredParty = getPreferredParty;
function getUsersRole(claim, user) {
    if (claim.claimantId === user.id && claim.response !== undefined) {
        return madeBy_1.MadeBy.CLAIMANT;
    }
    else if (claim.defendantId === user.id && claim.response === undefined) {
        return madeBy_1.MadeBy.DEFENDANT;
    }
    else {
        throw Error('User has no role in claim');
    }
}
exports.getUsersRole = getUsersRole;
