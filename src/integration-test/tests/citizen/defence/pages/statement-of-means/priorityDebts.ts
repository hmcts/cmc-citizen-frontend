import I = CodeceptJS.I

const I: I = actor()

const fields = {
  mortgage: {
    declared: 'input[id="mortgageDeclared"]',
    amount: 'input[id="mortgage"]'
  },
  rent: {
    declared: 'input[id="rentDeclared"]',
    amount: 'input[id="rent"]'
  },
  councilTax: {
    declared: 'input[id="councilTaxDeclared"]',
    amount: 'input[id="councilTax"]'
  },
  gas: {
    declared: 'input[id="gasDeclared"]',
    amount: 'input[id="gas"]'
  },
  electricity: {
    declared: 'input[id="electricityDeclared"]',
    amount: 'input[id="electricity"]'
  },
  water: {
    declared: 'input[id="waterDeclared"]',
    amount: 'input[id="water"]'
  },
  maintenance: {
    declared: 'input[id="maintenanceDeclared"]',
    amount: 'input[id="maintenance"]'
  }
}

const buttons = {
  resetMortgage: 'input[id="action[resetDebt][mortgage]"]',
  resetRent: 'input[id="action[resetDebt][rent]"]',
  resetCouncilTax: 'input[id="action[resetDebt][councilTax]"]',
  resetGas: 'input[id="action[resetDebt][gas]"]',
  resetElectricity: 'input[id="action[resetDebt][electricity]"]',
  resetWater: 'input[id="action[resetDebt][water]"]',
  resetMaintenance: 'input[id="action[resetDebt][maintenance]"]',
  submit: 'input[id="saveAndContinue"]'
}

export class PriorityDebtsPage {

  declareMortgage (repayments: number): void {
    I.checkOption(fields.mortgage.declared)
    I.fillField(fields.mortgage.amount, repayments.toFixed())
  }

  resetMortgage (): void {
    I.click(buttons.resetMortgage)
  }

  declareRent (repayments: number): void {
    I.checkOption(fields.rent.declared)
    I.fillField(fields.rent.amount, repayments.toFixed())
  }

  resetRent (): void {
    I.click(buttons.resetRent)
  }

  declareCouncilTax (repayments: number): void {
    I.checkOption(fields.councilTax.declared)
    I.fillField(fields.councilTax.amount, repayments.toFixed())
  }

  resetCouncilTax (): void {
    I.click(buttons.resetCouncilTax)
  }

  declareGas (repayments: number): void {
    I.checkOption(fields.gas.declared)
    I.fillField(fields.gas.amount, repayments.toFixed())
  }

  resetGas (): void {
    I.click(buttons.resetGas)
  }

  declareElectricity (repayments: number): void {
    I.checkOption(fields.electricity.declared)
    I.fillField(fields.electricity.amount, repayments.toFixed())
  }

  resetElectricity (): void {
    I.click(buttons.resetElectricity)
  }

  declareWater (repayments: number): void {
    I.checkOption(fields.water.declared)
    I.fillField(fields.water.amount, repayments.toFixed())
  }

  resetWater (): void {
    I.click(buttons.resetWater)
  }

  declareMaintenance (repayments: number): void {
    I.checkOption(fields.maintenance.declared)
    I.fillField(fields.maintenance.amount, repayments.toFixed())
  }

  resetMaintenance (): void {
    I.click(buttons.resetMaintenance)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
