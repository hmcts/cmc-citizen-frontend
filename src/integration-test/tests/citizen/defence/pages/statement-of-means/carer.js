"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    isCarer: 'input[id=optionyes]',
    notCarer: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class CarerPage {
    selectYesOption() {
        I.checkOption(fields.isCarer);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.notCarer);
        I.click(buttons.submit);
    }
}
exports.CarerPage = CarerPage;
