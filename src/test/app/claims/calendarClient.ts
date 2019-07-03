import { MomentFactory } from 'shared/momentFactory'
import { mockNextWorkingDay } from '../../http-mocks/claim-store'
import { expect } from 'chai'
import { CalendarClient } from 'claims/calendarClient'

describe('calendar', () => {

  it(`should return following Monday when date is Saturday and no days to add`, async () => {
    const SATURDAY = MomentFactory.parse('2019-06-29')
    const MONDAY_AFTER = '2019-07-01'
    mockNextWorkingDay(MONDAY_AFTER)

    const nextWorkingDay = await CalendarClient.getNextWorkingDay(SATURDAY, 0)

    expect(nextWorkingDay.toISOString(false)).to.equal(MomentFactory.parse(MONDAY_AFTER).toISOString(false))
  })

})
