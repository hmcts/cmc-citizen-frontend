import * as moment from 'moment'
import { LocalDate } from 'forms/models/localDate'

export function localDateFrom (momentObject: moment.Moment): LocalDate {
  return new LocalDate(momentObject.year(), momentObject.month() + 1, momentObject.date())
}

export function daysFromNow (adjustment: number): LocalDate {
  let mDate: moment.Moment = moment()
  mDate.add(adjustment, 'days')
  return LocalDate.fromMoment(mDate)
}
