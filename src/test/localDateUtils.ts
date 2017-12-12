import * as moment from 'moment'
import { LocalDate } from 'forms/models/localDate'

export function localDateFrom (momentObject: moment.Moment): LocalDate {
  return new LocalDate(momentObject.year(), momentObject.month() + 1, momentObject.date())
}
