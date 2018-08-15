import { Frequency } from 'common/statement-of-means/models/frequency'

export function convertAmountToMonthly (amount: number, frequency: Frequency): number {
  return amount * frequency.monthlyRatio
}

export function convertAmountToWeekly (amount: number, frequency: Frequency) {
  return convertAmountToMonthly(amount, frequency) / Frequency.WEEKLY.monthlyRatio
}

export function convertAmountToTwoWeekly (amount: number, frequency: Frequency) {
  return convertAmountToMonthly(amount, frequency) / Frequency.TWO_WEEKLY.monthlyRatio
}

export function convertAmountToFourWeekly (amount: number, frequency: Frequency) {
  return convertAmountToMonthly(amount, frequency) / Frequency.FOUR_WEEKLY.monthlyRatio
}
