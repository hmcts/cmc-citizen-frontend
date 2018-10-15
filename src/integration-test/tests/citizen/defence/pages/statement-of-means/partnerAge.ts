import I = CodeceptJS.I

const I: I = actor()

const fields = {
  partnerIsAdult: 'input[id=partnerAgeyes]',
  partnerNotAdult: 'input[id=partnerAgeno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerAgePage {

  selectYesOption (): void {
    I.checkOption(fields.partnerIsAdult)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.partnerNotAdult)
    I.click(buttons.submit)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
