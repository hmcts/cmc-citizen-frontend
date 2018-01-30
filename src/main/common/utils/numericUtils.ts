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

export function containsAValidComma (input: string): boolean {
  const output: string[] = input.split(',')

  return output[output.length - 1].length >= 3
}

export function toAValidFloatOrOriginalValue (input: string): any {
  const output: string = this.containsAValidComma(input) ? input.replace(new RegExp(/,/g), '') : input

  const numberValue = parseFloat(output)

  if (!output.includes(',') && !isNaN(numberValue) && !this.isExponential(numberValue)) {
    return numberValue
  } else {
    return output
  }
}

export function isExponential (numberValue: number) {
  return numberValue.toString().match(new RegExp('\\d*[Ee][+-]?\\d*?'))
}

export function toAValidNumberOrOriginalValue (input: string): any {

  const output: string = this.containsAValidComma(input) ? input.replace(new RegExp(/,/g), '') : input
  const numberValue = _.toNumber(output)

  if (!output.includes(',') && !isNaN(numberValue) && !this.isExponential(numberValue)) {
    return numberValue
  } else {
    return output
  }
}
