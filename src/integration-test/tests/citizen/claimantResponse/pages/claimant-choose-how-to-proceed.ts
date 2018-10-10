import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioSettlement: 'input[id=optionsignSettlementAgreement]',
  radioCcj: 'input[id=optionrequestCCJ]',
  submit: 'input[id=saveAndContinue]'
}

export class ClaimantChooseHowToProceed {

  chooseSettlement (): void {
    I.checkOption(fields.radioSettlement)
    I.click(fields.submit)
  }

  chooseCcj (): void {
    I.checkOption(fields.radioCcj)
    I.click(fields.submit)
  }

}
