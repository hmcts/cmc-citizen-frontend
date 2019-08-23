import I = CodeceptJS.I

const I: I = actor()

const fields = {
  day: '.day'
}
const buttons = {
  submit: 'input[type=submit]'
}

export class HearingDatesPage {

  chooseYes (): void {
    I.checkOption('Yes')
    I.seeElement(fields.day)
    I.click(fields.day)
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
