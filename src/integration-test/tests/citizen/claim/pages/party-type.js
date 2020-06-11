"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    partyType: {
        individual: 'input[id="typeindividual"]',
        soleTrader: 'input[id="typesoleTrader"]',
        company: 'input[id="typecompany"]',
        organisation: 'input[id="typeorganisation"]'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class PartyTypePage {
    selectIndividual() {
        I.checkOption(fields.partyType.individual);
        I.click(buttons.submit);
    }
    selectSoleTrader() {
        I.checkOption(fields.partyType.soleTrader);
        I.click(buttons.submit);
    }
    selectCompany() {
        I.checkOption(fields.partyType.company);
        I.click(buttons.submit);
    }
    selectOrganisationl() {
        I.checkOption(fields.partyType.organisation);
        I.click(buttons.submit);
    }
}
exports.PartyTypePage = PartyTypePage;
