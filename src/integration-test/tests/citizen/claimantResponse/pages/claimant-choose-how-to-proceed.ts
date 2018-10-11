import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioSettlement: 'input[id=optionsignSettlementAgreement]',
  radioRequestCcj: 'input[id=optionrequestCCJ]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class ClaimantChooseHowToProceed {

  chooseSettlement (): void {
    I.checkOption(fields.radioSettlement)
    I.click(buttons.saveAndContinue)
  }

  chooseRequestCcj (): void {
    I.checkOption(fields.radioRequestCcj)
    I.click(buttons.saveAndContinue)
  }

}
