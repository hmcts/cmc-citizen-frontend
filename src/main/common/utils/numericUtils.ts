import * as numeral from 'numeral'

export function toNumberOrUndefined (value: any): number {
  if ([undefined, NaN, '', null, false].indexOf(value) !== -1) {
    return undefined
  }

  if (value === 0 || value === '0') {
    return 0
  }

  const strVal: string = value && value.toString().trim()

  // checks length, followed by a filter by not containing ',' or valid thousand separators
  const numberVal: number = strVal.length > 0
    ? (!strVal.includes(',') || containsAThousandSeparator(strVal))
      ? numeral(strVal).value()
      : strVal
    : undefined

  // returns undefined for
  return !numberVal ? undefined : numberVal
}

function containsAThousandSeparator (input: string): boolean {
  const matchedArray = input.match(/^[1-9]\d{0,2}(\,\d{3})+(\.\d*)?$/)
  return matchedArray ? matchedArray.length > 0 : false
}
