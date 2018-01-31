import * as _ from 'lodash'

export function toNumberOrUndefined (value: any): number {
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

export function containsAThousandSeparator (input: string): boolean {
  const output: string[] = input.split(',')

  for (let i: number = 0; i < output.length; i++) {
    if (i === output.length - 1 && output[i].length < 3) {
      return false
    } else if (output[i].length > 3) {
      return false
    }
  }

  return true
}
