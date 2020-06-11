"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    paymentOption: {
        Immediately: 'input[id=optionIMMEDIATELY]',
        Instalments: 'input[id=optionINSTALMENTS]',
        BySetDate: 'input[id=optionBY_SPECIFIED_DATE]'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantPaymentOptionPage {
    chooseImmediately() {
        I.checkOption(fields.paymentOption.Immediately);
        I.click(buttons.submit);
    }
    chooseInstalments() {
        I.checkOption(fields.paymentOption.Instalments);
        I.click(buttons.submit);
    }
    chooseFullBySetDate() {
        I.checkOption(fields.paymentOption.BySetDate);
        I.click(buttons.submit);
    }
}
exports.ClaimantPaymentOptionPage = ClaimantPaymentOptionPage;
