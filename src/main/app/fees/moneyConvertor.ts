export default class MoneyConvertor {

  static convertPenniesToPounds (amount: number): number {
    return amount / 100
  }

  static convertPoundsToPennies (amount: number): number {
    return Math.round(amount * 100)
  }
}
