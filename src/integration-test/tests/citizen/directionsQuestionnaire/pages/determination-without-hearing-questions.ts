import I = CodeceptJS.I

const I: I = actor()

const heading = {
  text: 'Determination without Hearing Questions'
}
const buttons = {
  submit: { css: 'input[type=submit]' }
}
const fields = {
  determinationWithoutHearingQuestionsDetails: { css: 'input[id="determinationWithoutHearingQuestionsDetails"]' }
}

export class DeterminationWithoutHearingQuestionsPage {

  chooseYes (): void {
    I.waitForText(heading.text)
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption('No')
    I.fillField(fields.determinationWithoutHearingQuestionsDetails, 'determination')
    I.click(buttons.submit)
  }
}
