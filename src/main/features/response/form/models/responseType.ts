export class ResponseType {
  static readonly OWE_ALL_PAID_NONE = new ResponseType('OWE_ALL_PAID_NONE', 'I admit all of the claim')
  static readonly OWE_SOME_PAID_NONE = new ResponseType('OWE_SOME_PAID_NONE', 'I reject part of the claim')
  static readonly OWE_NONE = new ResponseType('OWE_NONE', 'I reject all of the claim')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): ResponseType[] {
    return [
      ResponseType.OWE_ALL_PAID_NONE,
      ResponseType.OWE_SOME_PAID_NONE,
      ResponseType.OWE_NONE
    ]
  }

  static valueOf (value: string): ResponseType {
    return ResponseType.all().filter(item => item.value === value).pop()
  }
}
