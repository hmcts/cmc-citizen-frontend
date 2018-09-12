import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment) {
  if (!startDate) {
    throw new Error(`Start Date is invalid`)
  }

  const futureMonth = moment(startDate).add(1, 'M')

  return startDate.date() !== futureMonth.date() && futureMonth.daysInMonth() === futureMonth.date() ? futureMonth.add(1, 'd') : futureMonth
}
