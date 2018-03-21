import * as numeral from 'numeral'

require('numeral/locales/en-gb')
numeral.locale('en-gb')
numeral.defaultFormat('$0,0[.]00')

export class AmountHelper extends codecept_helper {
  static formatMoney (amount: number): string {
    return numeral(amount).format()
  }
}
