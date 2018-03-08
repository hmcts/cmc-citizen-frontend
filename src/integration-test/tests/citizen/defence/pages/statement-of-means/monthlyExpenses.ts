import I = CodeceptJS.I

const I: I = actor()

const fields = {
  mortgage: 'input[id="mortgage"]',
  rent: 'input[id="rent"]',
  councilTax: 'input[id="councilTax"]',
  gas: 'input[id="gas"]',
  electricity: 'input[id="electricity"]',
  water: 'input[id="water"]',
  travel: 'input[id="travel"]',
  schoolCosts: 'input[id="schoolCosts"]',
  foodAndHousekeeping: 'input[id="foodAndHousekeeping"]',
  tvAndBroadband: 'input[id="tvAndBroadband"]',
  mobilePhone: 'input[id="mobilePhone"]',
  maintenance: 'input[id="maintenance"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class MonthlyExpensesPage {

  fillOutAllFieldsAndContinue (): void {
    I.fillField(fields.mortgage, '10')
    I.fillField(fields.rent, '10')
    I.fillField(fields.councilTax, '10')
    I.fillField(fields.gas, '10')
    I.fillField(fields.electricity, '10')
    I.fillField(fields.water, '10')
    I.fillField(fields.travel, '10')
    I.fillField(fields.schoolCosts, '10')
    I.fillField(fields.foodAndHousekeeping, '10')
    I.fillField(fields.tvAndBroadband, '10')
    I.fillField(fields.mobilePhone, '10')
    I.fillField(fields.maintenance, '10')

    I.click(buttons.submit)
  }
}
