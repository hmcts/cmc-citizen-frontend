import I = CodeceptJS.I

const I: I = actor()

const fields = {
  courtName: {
    input: 'input[id="alternativeCourtName"]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class HearingLocationPage {
  chooseYes (): void {
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (courtName: string): void {
    I.checkOption('No')
    I.fillField(fields.courtName.input, courtName)
  }
}
