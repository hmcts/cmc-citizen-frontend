import * as moment from 'moment'

export class MomentFactory {
  static currentDateTime (): moment.Moment {
    return moment()
  }

  static currentDate (): moment.Moment {
    return moment().hours(0).minutes(0).seconds(0).milliseconds(0)
  }

  static parse (value: string): moment.Moment {
    if (!value) {
      throw new Error('Value must be defined')
    }
    return moment(value)
  }
}
