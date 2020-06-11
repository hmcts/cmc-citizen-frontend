"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const date_parser_1 = require("integration-test/utils/date-parser");
const amountHelper_1 = require("integration-test/helpers/amountHelper");
const I = actor();
const fields = {
    repayment: {
        equalInstalments: 'input[id=instalmentAmount]',
        firstPaymentDate: {
            day: 'input[id=\'firstPaymentDate[day]\']',
            month: 'input[id=\'firstPaymentDate[month]\']',
            year: 'input[id=\'firstPaymentDate[year]\']'
        },
        frequency: {
            everyWeek: 'input[id=paymentScheduleEACH_WEEK]',
            everyTwoWeeks: 'input[id=paymentScheduleEVERY_TWO_WEEKS]',
            everyMonth: 'input[id=paymentScheduleEVERY_MONTH]'
        }
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantPayByInstalmentsPage {
    checkOutstandingAmount(defendantPaidAmount) {
        const amountOutstanding = test_data_1.claimAmount.getTotal() - defendantPaidAmount;
        I.see('Total claim amount is ' + amountHelper_1.AmountHelper.formatMoney(amountOutstanding));
    }
    enterRepaymentPlan(plan) {
        const [year, month, day] = date_parser_1.DateParser.parse(plan.firstPaymentDate);
        I.fillField(fields.repayment.equalInstalments, plan.equalInstalment.toString());
        I.fillField(fields.repayment.firstPaymentDate.day, day);
        I.fillField(fields.repayment.firstPaymentDate.month, month);
        I.fillField(fields.repayment.firstPaymentDate.year, year);
        I.checkOption(fields.repayment.frequency[plan.frequency]);
        I.click(buttons.submit);
    }
    saveAndContinue() {
        I.click(buttons.submit);
    }
}
exports.DefendantPayByInstalmentsPage = DefendantPayByInstalmentsPage;
