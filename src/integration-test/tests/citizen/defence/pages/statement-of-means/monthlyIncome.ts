import I = CodeceptJS.I

const I: I = actor()

const fields = {
  salary: 'input[id="salary"]',
  universalCredit: 'input[id="universalCredit"]',
  jobSeekerAllowanceIncome: 'input[id="jobSeekerAllowanceIncome"]',
  jobSeekerAllowanceContribution: 'input[id="jobSeekerAllowanceContribution"]',
  incomeSupport: 'input[id="incomeSupport"]',
  workingTaxCredit: 'input[id="workingTaxCredit"]',
  childTaxCredit: 'input[id="childTaxCredit"]',
  childBenefit: 'input[id="childBenefit"]',
  councilTaxSupport: 'input[id="councilTaxSupport"]',
  pension: 'input[id="pension"]',
  maintenance: 'input[id="maintenance"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class MonthlyIncomePage {

  fillOutAllFieldsAndContinue (): void {
    I.fillField(fields.salary, '10')
    I.fillField(fields.universalCredit, '10')
    I.fillField(fields.jobSeekerAllowanceIncome, '10')
    I.fillField(fields.jobSeekerAllowanceContribution, '10')
    I.fillField(fields.incomeSupport, '10')
    I.fillField(fields.workingTaxCredit, '10')
    I.fillField(fields.childTaxCredit, '10')
    I.fillField(fields.childBenefit, '10')
    I.fillField(fields.councilTaxSupport, '10')
    I.fillField(fields.pension, '10')
    I.fillField(fields.maintenance, '10')

    I.click(buttons.submit)
  }
}
