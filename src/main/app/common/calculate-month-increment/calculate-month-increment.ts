import * as moment from 'moment'

export function calculateMonthIncrement (startDate: moment.Moment) {
  if (!startDate) {
    return startDate
  }

  const futureMonth = moment(startDate).add(1, 'M')
  const futureMonthEnd = moment(futureMonth).endOf('month')
  return startDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD')) ? futureMonth.add(1, 'd') : futureMonth
}
