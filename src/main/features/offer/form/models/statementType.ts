export class StatementType {
  static readonly OFFER = new StatementType('OFFER', 'Offer')
  static readonly ACCEPTATION = new StatementType('ACCEPTATION', 'Acceptation')
  static readonly REJECTION = new StatementType('REJECTION', 'Rejection')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static valueOf (value: string): StatementType {
    return StatementType.all().filter(type => type.value === value).pop()
  }

  static all (): StatementType[] {
    return [
      StatementType.OFFER,
      StatementType.ACCEPTATION,
      StatementType.REJECTION
    ]
  }
}
