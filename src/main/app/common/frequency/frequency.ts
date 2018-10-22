import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'


export class Frequency {
  static readonly WEEKLY = new Frequency(['WEEK', 'EACH_WEEK'], 52 / 12, 1, 'Each week')
  static readonly TWO_WEEKLY = new Frequency(['TWO_WEEK', 'EVERY_TWO_WEEKS'], 52 / 12 / 2, 2, 'Every 2 weeks')
  static readonly FOUR_WEEKLY = new Frequency(['FOUR_WEEK', 'EVERY_FOUR_WEEKS'], 52 / 12 / 4, 4, 'Every 4 weeks')
  static readonly MONTHLY = new Frequency(['MONTH', 'EVERY_MONTH'], 1, 52 / 12, 'Every month')

  constructor (
    private readonly values: string[],
    public readonly monthlyRatio: number,
    public readonly inWeeks: number,
    public readonly displayValue: string
  ) {}

  static all (): Frequency[] {
    return [
      Frequency.WEEKLY,
      Frequency.TWO_WEEKLY,
      Frequency.FOUR_WEEKLY,
      Frequency.MONTHLY
    ]
  }

  static of (value: string): Frequency {
    const matchByFrequencyValue = (frequencyValue: string) => frequencyValue === value
    const filterByFrequencyValues = (frequency: Frequency) => frequency.values.some(matchByFrequencyValue)

    const result: Frequency = Frequency.all().filter(filterByFrequencyValues).pop()

    if (result) {
      return result
    }

    throw new Error(`There is no Frequency for value: '${value}'`)
  }

  static ofWeekly (weeklyValue: number): Frequency {
    const filterByFrequencyWeeklyValue = (frequency: Frequency) => frequency.inWeeks === weeklyValue

    const result: Frequency = Frequency.all().filter(filterByFrequencyWeeklyValue).pop()

    if (result) {
      return result
    }

    throw new Error(`There is no Frequency for weekly value: '${weeklyValue}'`)
  }

  static toPaymentSchedule (frequency: Frequency): PaymentSchedule {
    for (const value of frequency.values) {
      switch (value) {
        case PaymentSchedule.EACH_WEEK.value: {
          return PaymentSchedule.EACH_WEEK
        }
        case PaymentSchedule.EVERY_TWO_WEEKS.value: {
          return PaymentSchedule.EVERY_TWO_WEEKS
        }
        case PaymentSchedule.EVERY_MONTH.value: {
          return PaymentSchedule.EVERY_MONTH
        }
      }
    }
  }
}
