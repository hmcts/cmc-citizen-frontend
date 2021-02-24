import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason: { css: 'textarea[id="reason"]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class HearingExceptionalCircumstancesPage {
  chooseYes (): void {
    I.waitForText('Yes')
    I.checkOption('Yes')
    I.fillField(fields.reason, 'Some Reason')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText('No')
    I.checkOption('No')
    I.fillField(fields.reason, 'Some Reason')
    I.click(buttons.submit)
  }
}
