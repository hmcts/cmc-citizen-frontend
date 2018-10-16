import I = CodeceptJS.I

const I: I = actor()

const fields = {
  partnerIsSeverelyDisabled: 'input[id=partnerSeverelyDisabledyes]',
  partnerNotSeverelyDisabled: 'input[id=partnerSeverelyDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerSevereDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.partnerIsSeverelyDisabled)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.partnerNotSeverelyDisabled)
    I.click(buttons.submit)
  }
}
