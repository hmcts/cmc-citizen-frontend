import I = CodeceptJS.I

const I: I = actor()

const heading = {
  partialText: 'location'
}
const fields = {
  alternativeCourtName: { css: 'input[id="alternativeCourtName"]' },
  enterACourtName: { css: 'input[id="alternativeOptionname"]' }
}
const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class HearingLocationPage {
  chooseYes (): void {
    I.waitForText(heading.partialText)
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.partialText)
    I.checkOption('No')
    I.waitForElement('#alternativeOptionname')
    I.checkOption(fields.enterACourtName)
    I.fillField(fields.alternativeCourtName, 'My own court where i am the judge')
    I.click(buttons.submit)
  }

  chooseNoAsClaimant (): void {
    I.waitForText(heading.partialText)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
