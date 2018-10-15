import I = CodeceptJS.I

const I: I = actor()

const fields = {
  partnerHasPension: 'input[id=partnerPensionyes]',
  partnerNoPension: 'input[id=partnerPensionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerPensionPage {

  selectYesOption (): void {
    I.checkOption(fields.partnerHasPension)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.partnerNoPension)
    I.click(buttons.submit)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
