import * as moment from 'moment'

export function calculateMonthIncrement (d: moment.Moment) {
  const futureMonth = moment(d).add(1, 'M')
  const futureMonthEnd = moment(futureMonth).endOf('month')
  return d.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD')) ? futureMonth.add(1, 'd') : futureMonth
}
