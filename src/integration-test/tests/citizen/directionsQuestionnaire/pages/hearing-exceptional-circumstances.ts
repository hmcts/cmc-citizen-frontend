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
    I.click(buttons.submit)
  }

  chooseNo (reason: string): void {
    I.checkOption('No')
    I.fillField(fields.reason, reason)
  }
}
