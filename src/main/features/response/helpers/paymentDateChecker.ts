import * as moment from 'moment'
import { MomentFactory } from 'common/momentFactory'

export class PaymentDateChecker {
  static isLaterThan28DaysFromNow (date: moment.Moment): boolean {
    const twentyEightDaysFromNow: moment.Moment = MomentFactory.currentDate().add(28, 'days')
    return date.isAfter(twentyEightDaysFromNow)
  }
}
