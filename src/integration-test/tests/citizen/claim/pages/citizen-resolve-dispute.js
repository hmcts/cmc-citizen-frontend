"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class CitizenResolveDisputePage {
    open() {
        I.amOnCitizenAppPage('/claim/resolving-this-dispute');
    }
    confirmRead() {
        I.click(buttons.submit);
    }
}
exports.CitizenResolveDisputePage = CitizenResolveDisputePage;
