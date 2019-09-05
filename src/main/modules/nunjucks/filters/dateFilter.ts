import { MomentFormatter } from 'utils/momentFormatter'
import * as moment from 'moment'
import { Logger } from '@hmcts/nodejs-logging'
import { MomentFactory } from 'shared/momentFactory'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'

const logger = Logger.getLogger('modules/nunjucks/dateFilter')

/* *
 * This filter should be used when you need a date in long format for content
 *
 * Usage (in njk):
 * {{ myDateVar | date }}
 *
 * output:
 *  6 April 2018
 * */
export function dateFilter (value: moment.Moment | string): string {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    const date: moment.Moment = typeof value === 'string' ? moment(value) : value
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return MomentFormatter.formatLongDate(date)
  } catch (err) {
    logger.error(err)
    throw err
  }
}

/* *
 * This filter should be used when you need a date in a format that matches input fields
 *
 * Usage (in njk):
 * {{ myDateVar | inputDate }}
 *
 * output:
 *  6 4 2018
 * */
export function dateInputFilter (value: moment.Moment | string): string {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    const date: moment.Moment = typeof value === 'string' ? moment(value) : value
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return MomentFormatter.formatInputDate(date)
  } catch (err) {
    logger.error(err)
    throw err
  }
}

/* *
 * This filter should be used when you need a date in long format for content
 *
 * Usage (in njk):
 * {{ myDateVar | date }}
 *
 * output:
 *  Thursday 6 April 2018
 * */
export function dateWithDayAtFrontFilter (value: moment.Moment | string): string {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    const date: moment.Moment = typeof value === 'string' ? moment(value) : value
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return MomentFormatter.formatDayDate(date)
  } catch (err) {
    logger.error(err)
    throw err
  }
}

/* *
 * This filter should be used when you need to dynamically modify a date. The keyword 'now' may be given as
 * input to generate dates relative to the current date.
 *
 * Usage (in njk):
 * Example 1:
 * {{ someMoment | addDays(1) }}
 *
 * output:
 *  a moment representing the day after that given
 *
 * Example 2:
 * {{ 'now' | addDays(-7) }}
 *
 * output:
 *  a moment representing the date 1 week before today
 */
export function addDaysFilter (value: moment.Moment | string, num: number): moment.Moment {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    let date: moment.Moment
    if (typeof value === 'string') {
      if (value === 'now') {
        date = MomentFactory.currentDate()
      } else {
        date = moment(value)
      }
    } else {
      date = value.clone()
    }
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return date.add(num, 'day')
  } catch (err) {
    logger.error(err)
    throw err
  }
}

/* *
 * This filter should be used when you need to return a monthly increment from a given date.
 * The keyword 'now' may be given as input to generate dates relative to the current date.
 *
 * Usage (in njk):
 * Example 1:
 * {{ someMoment | monthIncrementFilter('2018-01-01') }}
 *
 * output:
 *  a moment representing the date for a monthly increment
 */
export function monthIncrementFilter (value: moment.Moment | string): moment.Moment {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    let date: moment.Moment
    if (typeof value === 'string') {
      if (value === 'now') {
        date = moment()
      } else {
        date = moment(value)
      }
    } else {
      date = value
    }
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return calculateMonthIncrement(date)
  } catch (err) {
    logger.error(err)
    throw err
  }
}
