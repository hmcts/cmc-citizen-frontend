import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment) {
  if (!startDate) {
    throw new Error(`Start Date is invalid`)
  }

  const futureMonth = moment(startDate).add(1, 'M')

  if ((startDate.date() !== futureMonth.date()) &&
    (futureMonth.daysInMonth() === futureMonth.date())) {
    return futureMonth.add(1, 'd')
  }

  return futureMonth
}
