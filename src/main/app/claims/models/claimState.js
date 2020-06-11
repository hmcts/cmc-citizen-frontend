"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClaimState;
(function (ClaimState) {
    ClaimState[ClaimState["CREATE"] = 0] = "CREATE";
    ClaimState[ClaimState["OPEN"] = 1] = "OPEN";
    ClaimState[ClaimState["CLOSED"] = 2] = "CLOSED";
    ClaimState[ClaimState["SETTLED"] = 3] = "SETTLED";
    ClaimState[ClaimState["SETTLEMENT_AGREEMENT_MADE"] = 4] = "SETTLEMENT_AGREEMENT_MADE";
    ClaimState[ClaimState["READY_FOR_LEGAL_ADVISOR_DIRECTIONS"] = 5] = "READY_FOR_LEGAL_ADVISOR_DIRECTIONS";
    ClaimState[ClaimState["READY_FOR_JUDGE_DIRECTIONS"] = 6] = "READY_FOR_JUDGE_DIRECTIONS";
    ClaimState[ClaimState["STAYED"] = 7] = "STAYED";
    ClaimState[ClaimState["ORDER_FOR_JUDGE_REVIEW"] = 8] = "ORDER_FOR_JUDGE_REVIEW";
    ClaimState[ClaimState["ORDER_FOR_LA_REVIEW"] = 9] = "ORDER_FOR_LA_REVIEW";
    ClaimState[ClaimState["ORDER_DRAWN"] = 10] = "ORDER_DRAWN";
    ClaimState[ClaimState["TRANSFERRED"] = 11] = "TRANSFERRED";
    ClaimState[ClaimState["APPROVED"] = 12] = "APPROVED";
    ClaimState[ClaimState["READY_FOR_TRANSFER"] = 13] = "READY_FOR_TRANSFER";
    ClaimState[ClaimState["RECONSIDERATION_REQUESTED"] = 14] = "RECONSIDERATION_REQUESTED";
    ClaimState[ClaimState["REFERRED_MEDIATION"] = 15] = "REFERRED_MEDIATION";
    ClaimState[ClaimState["AWAITING_CITIZEN_PAYMENT"] = 16] = "AWAITING_CITIZEN_PAYMENT";
    ClaimState[ClaimState["PROCEEDS_IN_CASE_MAN"] = 17] = "PROCEEDS_IN_CASE_MAN";
    ClaimState[ClaimState["READY_FOR_PAPER_DQ"] = 18] = "READY_FOR_PAPER_DQ";
    ClaimState[ClaimState["JUDGMENT_DECIDE_AMOUNT"] = 19] = "JUDGMENT_DECIDE_AMOUNT";
    ClaimState[ClaimState["REDETERMINATION_REQUESTED"] = 20] = "REDETERMINATION_REQUESTED";
    ClaimState[ClaimState["JUDGMENT_REQUESTED"] = 21] = "JUDGMENT_REQUESTED";
})(ClaimState = exports.ClaimState || (exports.ClaimState = {}));
