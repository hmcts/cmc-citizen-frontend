import I = CodeceptJS.I

const I: I = actor()

const fields = {
  alternativeCourtName: 'input[id="alternativeCourtName"]',
  enterACourtName: 'input[id="alternativeOptionname"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class HearingLocationPage {
  chooseYes (): void {
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.waitForElement('#alternativeOptionname')
    I.checkOption(fields.enterACourtName)
    I.fillField(fields.alternativeCourtName, 'My own court where i am the judge')
    I.click(buttons.submit)
  }

  chooseNoAsClaimant (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
