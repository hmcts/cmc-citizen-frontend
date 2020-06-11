"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FormaliseRepaymentPlanOption {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT,
            FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
            FormaliseRepaymentPlanOption.REFER_TO_JUDGE
        ];
    }
    static valueOf(value) {
        return FormaliseRepaymentPlanOption.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption;
FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT = new FormaliseRepaymentPlanOption('signSettlementAgreement', 'Sign a settlement agreement');
FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT = new FormaliseRepaymentPlanOption('requestCCJ', 'Issue a County Court Judgment (CCJ)');
FormaliseRepaymentPlanOption.REFER_TO_JUDGE = new FormaliseRepaymentPlanOption('referToJudge', 'Refer to judge');
