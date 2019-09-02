import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason: 'textarea[id="reason"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class HearingExceptionalCircumstancesPage {
  chooseYes (): void {
    I.checkOption('Yes')
    I.fillField(fields.reason, 'Some Reason')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.fillField(fields.reason, 'Some Reason')
    I.click(buttons.submit)
  }
}
