import I = CodeceptJS.I

const I: I = actor()

const heading = {
  text: 'Do you consider that this claim is suitable for determination without a hearing, i.e. by a judge reading amd considering the case papers, witness statements and other documents filed by the parties, making a decision, and giving a note of reasons for that decision?'
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
    I.fillField(fields.determinationWithoutHearingQuestionsDetails, 'determination')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
