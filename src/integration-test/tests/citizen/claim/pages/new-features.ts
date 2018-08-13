import I = CodeceptJS.I
const I: I = actor()

const fields = {
  yes: 'input[id="consentResponseyes"]',
  no: 'input[id="consentResponseno"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class NewFeaturesPage {

  optIn (): void {
    I.checkOption(fields.yes)
    I.click(buttons.submit)
  }

}
