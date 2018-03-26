import I = CodeceptJS.I

const I: I = actor()

const fields = {
  typeSubmission: 'input[id=typesubmission]',
  typeCustom: 'input[id=typecustom]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestDatePage {

  selectSubmission (): void {
    I.checkOption(fields.typeSubmission)
    I.click(buttons.submit)
  }

  selectCustom (): void {
    I.checkOption(fields.typeCustom)
    I.click(buttons.submit)
  }
}
