"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    text: 'textarea[id=text]'
};
class CannotPayImmediatelyPage {
    enterExplaination() {
        I.fillField(fields.text, 'I cannot pay immediately');
    }
}
exports.CannotPayImmediatelyPage = CannotPayImmediatelyPage;
