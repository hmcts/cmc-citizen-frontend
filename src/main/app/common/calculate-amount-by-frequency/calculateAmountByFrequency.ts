import { Frequency } from 'common/calculate-amount-by-frequency/frequency'

export function toMonthly(amount: number, frequency: Frequency): number {
  return amount * frequency.monthlyRatio
}

export function toWeekly(amount: number, frequency: Frequency) {
  return toMonthly(amount, frequency) / Frequency.WEEKLY.monthlyRatio
}

export function toTwoWeekly(amount: number, frequency: Frequency) {
  return toMonthly(amount, frequency) / Frequency.TWO_WEEKLY.monthlyRatio
}

export function toFourWeekly(amount: number, frequency: Frequency) {
  return toMonthly(amount, frequency) / Frequency.FOUR_WEEKLY.monthlyRatio
}