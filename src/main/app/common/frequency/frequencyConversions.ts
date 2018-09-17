import { Frequency } from 'common/frequency/frequency'

export class FrequencyConversions {
  static convertAmountToMonthly (amount: number, frequency: Frequency): number {
    return amount * frequency.monthlyRatio
  }

  static convertAmountToWeekly (amount: number, frequency: Frequency) {
    return FrequencyConversions.convertAmountToMonthly(amount, frequency) / Frequency.WEEKLY.monthlyRatio
  }

  static convertAmountToTwoWeekly (amount: number, frequency: Frequency) {
    return FrequencyConversions.convertAmountToMonthly(amount, frequency) / Frequency.TWO_WEEKLY.monthlyRatio
  }

  static convertAmountToFourWeekly (amount: number, frequency: Frequency) {
    return FrequencyConversions.convertAmountToMonthly(amount, frequency) / Frequency.FOUR_WEEKLY.monthlyRatio
  }
}
