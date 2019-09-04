import I = CodeceptJS.I

const I: I = actor()

const fields = {
  next: '.next',
  prev: '.prev',
  day: '.day:not(.disabled)'
}
const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class HearingDatesPage {

  chooseYes (): void {
    I.checkOption('Yes')
    I.waitForElement(fields.next)
    I.click(fields.next)
    I.waitForElement(fields.prev)
    I.click(fields.day)
    I.waitForText('Remove')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
