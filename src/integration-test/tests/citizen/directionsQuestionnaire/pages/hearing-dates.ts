/* tslint:disable:no-console */

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

  async chooseYes (): Promise<void> {
    I.waitForText(heading.partialText)
    // BUG: Date Picker not displaying in IE11 for citizen-frontend (25/2/21),
    // remove this work-around once bug is fixed...
    const usingIE11 = await I.checkForIE11()
    if (usingIE11) {
      console.log('Skipping date picker due to bug in IE11: https://tools.hmcts.net/jira/browse/ROC-8904')
      I.checkOption('No')
      // ...end
    } else {
      I.checkOption('Yes')
      I.waitForElement(fields.next)
      I.click(fields.next)
      I.waitForElement(fields.prev)
      I.click(fields.day)
      I.waitForText('Remove')
    }
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.partialText)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
