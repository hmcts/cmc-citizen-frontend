import * as moment from 'moment'

function fourPM (responseDeadlineDay: moment.Moment): moment.Moment {
  return responseDeadlineDay.clone().hour(16).minute(0).second(0).millisecond(0)
}

export function isPastResponseDeadline (dateTime: moment.Moment, responseDeadline: moment.Moment): boolean {
  return dateTime.isSameOrAfter(fourPM(responseDeadline))
}
