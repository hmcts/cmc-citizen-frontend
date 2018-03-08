import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantYourDefencePage {

  enterYourDefence (defence: string): void {
    I.fillField(fields.reason, defence)
    I.click(buttons.submit)
  }
}
