export class MadeBy {
  static readonly CLAIMANT = new MadeBy('CLAIMANT', 'Claimant')
  static readonly DEFENDANT = new MadeBy('DEFENDANT', 'Defendant')
  static readonly COURT = new MadeBy('COURT', 'Court')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static valueOf (value: string): MadeBy {
    return MadeBy.all().filter(type => type.value === value).pop()
  }

  static all (): MadeBy[] {
    return [
      MadeBy.CLAIMANT,
      MadeBy.DEFENDANT
    ]
  }
}
