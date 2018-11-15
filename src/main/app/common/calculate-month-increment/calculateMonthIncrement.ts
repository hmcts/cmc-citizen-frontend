import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment) {
  if (!startDate) {
    return startDate
  }

  const futureMonth = moment(startDate).add(1, 'M')

  if ((startDate.date() !== futureMonth.date()) &&
    (futureMonth.daysInMonth() === futureMonth.date())) {
    return futureMonth.add(1, 'd')
  }

  return futureMonth
}

export function calculateMonthsIncrement (startDate: moment.Moment, monthsToAdd: number) {
  if (!startDate) {
    return startDate
  }

  const futureMonth = moment(startDate).add(monthsToAdd, 'months')
  if ((startDate.date() !== futureMonth.date()) &&
    (futureMonth.daysInMonth() === futureMonth.date())) {
    return futureMonth.add(1, 'days')
  }

  return futureMonth
}
