
export class Frequency {
  static readonly WEEKLY = new Frequency('WEEKLY', 52 / 12)
  static readonly TWO_WEEKLY = new Frequency('TWO_WEEKLY', 52 / 12 / 2)
  static readonly FOUR_WEEKLY = new Frequency('FOUR_WEEKLY', 52 / 12 / 4)
  static readonly MONTHLY = new Frequency('MONTHLY', 1)

  constructor (public readonly value: string, public readonly monthlyRatio: number) {}

  static all (): Frequency[] {
    return [
      Frequency.WEEKLY,
      Frequency.TWO_WEEKLY,
      Frequency.FOUR_WEEKLY,
      Frequency.MONTHLY
    ]
  }

  static of (value: string): Frequency {
    const result: Frequency = Frequency.all().filter(item => item.value === value).pop()

    if (result) {
      return result
    }

    throw new Error(`There is no Frequency: '${value}'`)
  }
}
