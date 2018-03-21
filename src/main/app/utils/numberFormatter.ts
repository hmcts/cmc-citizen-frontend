import * as numeral from 'numeral'

export const NUMBER_FORMAT = '$0,0[.]00'

export class NumberFormatter {

  static formatMoney (value: number): string {
    return numeral(value).format(NUMBER_FORMAT)
  }
}
