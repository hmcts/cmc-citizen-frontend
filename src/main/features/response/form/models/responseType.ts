export class ResponseType {
  static readonly OWE_ALL_PAID_NONE = new ResponseType('OWE_ALL_PAID_NONE', 'I owe all of the money')
  static readonly OWE_SOME_PAID_NONE = new ResponseType('OWE_SOME_PAID_NONE', 'I owe some of the money')
  static readonly OWE_NONE = new ResponseType('OWE_NONE', 'I reject the money claim')

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
}
