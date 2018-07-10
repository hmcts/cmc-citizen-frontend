import I = CodeceptJS.I

const I: I = actor()

const fields = {
  jobTitle: 'input[id="jobTitle"]',
  annualTurnover: 'input[id="annualTurnover"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class SelfEmploymentPage {

  enterDetails (jobTitle: string, annualTurnover: number) {
    I.fillField(fields.jobTitle, jobTitle)
    I.fillField(fields.annualTurnover, annualTurnover.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
