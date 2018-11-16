import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment, monthsToAdd?: number) {

  if (!startDate) {
    throw new Error(`Start Date is invalid`)
  }
  if (monthsToAdd === null) {
    throw new Error(`monthsToAdd is invalid`)
  }

  const futureMonth = moment(startDate).add(monthsToAdd === undefined ? 1 : monthsToAdd, 'M')
  if ((startDate.date() !== futureMonth.date()) &&
    (futureMonth.daysInMonth() === futureMonth.date())) {
    return futureMonth.add(1, 'd')
  }

  return futureMonth
}
