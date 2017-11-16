import * as moment from 'moment'

export class PaymentDateChecker {
  static isLaterThan28DaysFromNow (date: moment.Moment): boolean {
    const twentyEightDaysFromNow: moment.Moment = moment().add(28, 'days')
    return date.isAfter(twentyEightDaysFromNow)
  }
}
