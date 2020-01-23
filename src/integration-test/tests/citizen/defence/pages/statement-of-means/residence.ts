import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    ownHome: 'input[id="typeOWN_HOME"]',
    other: 'input[id="typeOTHER"]'
  },
  housingDetails: 'input[id="housingDetails"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class ResidencePage {

  selectOwnHome (): void {
    I.checkOption(fields.options.ownHome)
  }

  selectOther (housingDetails: string): void {
    I.checkOption(fields.options.other)
    I.fillField(fields.housingDetails, housingDetails)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
