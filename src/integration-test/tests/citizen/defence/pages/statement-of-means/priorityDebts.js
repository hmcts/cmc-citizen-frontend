"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    mortgage: {
        declared: 'input[id="mortgageDeclaredtrue"]',
        amount: 'input[id="mortgage[amount]"]',
        schedule: {
            everyWeek: 'input[id="mortgage[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="mortgage[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=mortgage[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="mortgage[schedule]MONTH"]'
        }
    },
    rent: {
        declared: 'input[id="rentDeclaredtrue"]',
        amount: 'input[id="rent[amount]"]',
        schedule: {
            everyWeek: 'input[id="rent[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="rent[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=rent[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="rent[schedule]MONTH"]'
        }
    },
    councilTax: {
        declared: 'input[id="councilTaxDeclaredtrue"]',
        amount: 'input[id="councilTax[amount]"]',
        schedule: {
            everyWeek: 'input[id="councilTax[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="councilTax[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=councilTax[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="councilTax[schedule]MONTH"]'
        }
    },
    gas: {
        declared: 'input[id="gasDeclaredtrue"]',
        amount: 'input[id="gas[amount]"]',
        schedule: {
            everyWeek: 'input[id="gas[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="gas[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=gas[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="gas[schedule]MONTH"]'
        }
    },
    electricity: {
        declared: 'input[id="electricityDeclaredtrue"]',
        amount: 'input[id="electricity[amount]"]',
        schedule: {
            everyWeek: 'input[id="electricity[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="electricity[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=electricity[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="electricity[schedule]MONTH"]'
        }
    },
    water: {
        declared: 'input[id="waterDeclaredtrue"]',
        amount: 'input[id="water[amount]"]',
        schedule: {
            everyWeek: 'input[id="water[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="water[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=water[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="water[schedule]MONTH"]'
        }
    },
    maintenance: {
        declared: 'input[id="maintenanceDeclaredtrue"]',
        amount: 'input[id="maintenance[amount]"]',
        schedule: {
            everyWeek: 'input[id="maintenance[schedule]WEEK"]',
            everyTwoWeeks: 'input[id="maintenance[schedule]TWO_WEEKS"]',
            everyFourWeeks: 'input[id=maintenance[schedule]FOUR_WEEKS"]',
            everyMonth: 'input[id="maintenance[schedule]MONTH"]'
        }
    }
};
const buttons = {
    resetMortgage: 'input[id="action[resetDebt][mortgage]"]',
    resetRent: 'input[id="action[resetDebt][rent]"]',
    resetCouncilTax: 'input[id="action[resetDebt][councilTax]"]',
    resetGas: 'input[id="action[resetDebt][gas]"]',
    resetElectricity: 'input[id="action[resetDebt][electricity]"]',
    resetWater: 'input[id="action[resetDebt][water]"]',
    resetMaintenance: 'input[id="action[resetDebt][maintenance]"]',
    submit: 'input[id="saveAndContinue"]'
};
class PriorityDebtsPage {
    declareMortgage(repayments) {
        I.checkOption(fields.mortgage.declared);
        I.fillField(fields.mortgage.amount, repayments.toFixed());
        I.checkOption(fields.mortgage.schedule.everyMonth);
    }
    resetMortgage() {
        I.click(buttons.resetMortgage);
    }
    declareRent(repayments) {
        I.checkOption(fields.rent.declared);
        I.fillField(fields.rent.amount, repayments.toFixed());
        I.checkOption(fields.rent.schedule.everyMonth);
    }
    resetRent() {
        I.click(buttons.resetRent);
    }
    declareCouncilTax(repayments) {
        I.checkOption(fields.councilTax.declared);
        I.fillField(fields.councilTax.amount, repayments.toFixed());
        I.checkOption(fields.councilTax.schedule.everyMonth);
    }
    resetCouncilTax() {
        I.click(buttons.resetCouncilTax);
    }
    declareGas(repayments) {
        I.checkOption(fields.gas.declared);
        I.fillField(fields.gas.amount, repayments.toFixed());
        I.checkOption(fields.gas.schedule.everyMonth);
    }
    resetGas() {
        I.click(buttons.resetGas);
    }
    declareElectricity(repayments) {
        I.checkOption(fields.electricity.declared);
        I.fillField(fields.electricity.amount, repayments.toFixed());
        I.checkOption(fields.electricity.schedule.everyMonth);
    }
    resetElectricity() {
        I.click(buttons.resetElectricity);
    }
    declareWater(repayments) {
        I.checkOption(fields.water.declared);
        I.fillField(fields.water.amount, repayments.toFixed());
        I.checkOption(fields.water.schedule.everyMonth);
    }
    resetWater() {
        I.click(buttons.resetWater);
    }
    declareMaintenance(repayments) {
        I.checkOption(fields.maintenance.declared);
        I.fillField(fields.maintenance.amount, repayments.toFixed());
        I.checkOption(fields.maintenance.schedule.everyMonth);
    }
    resetMaintenance() {
        I.click(buttons.resetMaintenance);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.PriorityDebtsPage = PriorityDebtsPage;
