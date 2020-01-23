import * as moment from 'moment'
function fourPM (paymentDeadlineDay: moment.Moment): moment.Moment {
  return paymentDeadlineDay.clone().hour(16).minute(0).second(0).millisecond(0)
}
export function isPastDeadline (dateTime: moment.Moment, paymentDeadline: moment.Moment): boolean {
  return dateTime.isSameOrAfter(fourPM(paymentDeadline))
}
