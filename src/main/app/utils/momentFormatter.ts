import { Moment } from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const LONG_DATE_FORMAT = 'D MMMM YYYY'
export const TIME_FORMAT = 'h:mma'

export class MomentFormatter {

  static formatDate (value: Moment): string {
    return value.format(DATE_FORMAT)
  }

  static formatLongDate (value: Moment): string {
    return value.format(LONG_DATE_FORMAT)
  }

  static formatLongDateAndTime (value: Moment): string {
    return `${MomentFormatter.formatLongDate(value)} at ${value.format(TIME_FORMAT)}`
  }

}
