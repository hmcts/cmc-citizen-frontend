import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment, monthsToAdd?: number) {
  if (!startDate || monthsToAdd === null) {
    return startDate
  }

  const futureMonth = moment(startDate).add(monthsToAdd === undefined ? 1 : monthsToAdd, 'M')
  if ((startDate.date() !== futureMonth.date()) &&
    (futureMonth.daysInMonth() === futureMonth.date())) {
    return futureMonth.add(1, 'd')
  }

  return futureMonth
}
