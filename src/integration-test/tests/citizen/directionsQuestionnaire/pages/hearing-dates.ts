import I = CodeceptJS.I

const I: I = actor()

const heading = {
  partialText: 'Are there dates in the next 9 months'
}
const fields = {
  next: { css: '.next' },
  prev: { css: '.prev' },
  day: { css: '.day:not(.disabled)' }
}
const buttons = {
  submit: { css: 'input[id="saveAndContinue"]' }
}

export class HearingDatesPage {

  chooseYes (): void {
    I.waitForText(heading.partialText)
    I.checkOption('Yes')
    I.waitForElement(fields.next)
    I.click(fields.next)
    I.waitForElement(fields.prev)
    I.click(fields.day)
    I.waitForText('Remove')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.partialText)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
