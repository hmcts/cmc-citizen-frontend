import I = CodeceptJS.I

const I: I = actor()

const fields = {
  yes: 'input[id=partnerDisabledyes]',
  no: 'input[id=partnerDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.yes)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.no)
    I.click(buttons.submit)
  }
}
