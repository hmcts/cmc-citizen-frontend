import * as _ from 'lodash'

export class NumericUtils {

  static toNumberOrUndefined (value: any): number {

    if ([undefined, NaN, '', null, false].indexOf(value) !== -1) {
      return undefined
    }

    if (value === 0 || value === '0') {
      return 0
    }

    const strVal: string = value && value.toString().trim()
    const numberVal: number = strVal.length > 0 ? _.toNumber(strVal) : undefined

    return isNaN(numberVal) ? undefined : numberVal
  }
}
