import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionStandard: { css: 'input[id=optionSTANDARD_BS_ENTERED]' },
  optionMentalHealth: { css: 'input[id=optionMENTAL_BS_ENTERED]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class WhatTypeBsPage {

  selectBsType (): void {
    I.checkOption(fields.optionStandard)
    I.click(buttons.submit)
  }
}
