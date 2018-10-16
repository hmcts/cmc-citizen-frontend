import I = CodeceptJS.I

const I: I = actor()

const fields = {
  partnerIsDisabled: 'input[id=partnerDisabledyes]',
  partnerNotDisabled: 'input[id=partnerDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.partnerIsDisabled)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.partnerNotDisabled)
    I.click(buttons.submit)
  }
}
