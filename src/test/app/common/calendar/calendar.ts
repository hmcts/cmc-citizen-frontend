import { expect } from 'chai'
import { MomentFactory } from 'shared/momentFactory'
import { getNextWorkingDay } from 'common/calendar/calendar'
import { mockNextWorkingDay } from 'test/http-mocks/claim-store'

describe('calendar', () => {

  it(`should return following Monday when date is Saturday and no days to add`, async () => {
    const SATURDAY = MomentFactory.parse('2019-06-29')
    const MONDAY_AFTER = MomentFactory.parse('2019-07-01 12:00')
    mockNextWorkingDay(MONDAY_AFTER)

    const nextWorkingDay = await getNextWorkingDay(SATURDAY)

    expect(nextWorkingDay).to.equal(MONDAY_AFTER.toISOString())
  })

})
