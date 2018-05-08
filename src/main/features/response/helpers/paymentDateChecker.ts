import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'

function toDate (dateTime: moment.Moment): moment.Moment {
  const date: moment.Moment = dateTime.clone()
  date.hours(0)
  date.minutes(0)
  date.seconds(0)
  date.milliseconds(0)
  return date
}

export class PaymentDateChecker {
  static isLaterThan28DaysFromNow (inputDate: moment.Moment): boolean {
    const date: moment.Moment = toDate(inputDate)
    const twentyEightDaysFromNow: moment.Moment = MomentFactory.currentDate().add(28, 'days')
    return date.isAfter(twentyEightDaysFromNow)
  }
}
