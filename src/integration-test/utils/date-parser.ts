export class DateParser {
  static parse (date: string): string[] {
    if (!date) {
      throw new Error('Date is required')
    }

    return date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/).slice(1)
  }
}
