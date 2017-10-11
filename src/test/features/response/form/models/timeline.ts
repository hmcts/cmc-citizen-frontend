import { expect } from 'chai'

import { TimelineRow } from 'response/form/models/timelineRow'
import { INIT_ROW_COUNT, Timeline } from 'response/form/models/timeline'

describe('Timeline', () => {

  describe('initialRows', () => {

    it('should return array of empty instances of TimelineRow', () => {

      const actual: TimelineRow[] = Timeline.initialRows()

      expect(actual.length).to.equal(4)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = Timeline.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return Timeline with list of empty TimelineRow[] when empty input given', () => {
      const actual: Timeline = Timeline.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Timeline with first element on list populated', () => {
      const actual: Timeline = Timeline.fromObject({ rows: [{ date: 'May', description: 'OK' }] })

      const populatedItem: TimelineRow = actual.rows.pop()

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of TimelineRow longer than default', () => {
      const actual: Timeline = Timeline.fromObject(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' },
            { date: 'Jun', description: 'OK' }
          ]
        }
      )

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid Timeline object with list of empty TimelineRow', () => {
      const actual: Timeline = new Timeline().deserialize({})

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid Timeline object with populated first TimelineRow', () => {
      const actual: Timeline = new Timeline().deserialize(
        { rows: [{ date: 'May', description: 'OK' }] }
      )

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      const populatedItem: TimelineRow = actual.rows[0]

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows.slice(1))
    })

    it('should return valid Timeline object with list of row longer than default length', () => {
      const actual: Timeline = new Timeline().deserialize(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' }
          ]
        }
      )

      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('appendRow', () => {

    it('adds empty element to list of rows', () => {
      const actual: Timeline = new Timeline()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })
  })
})

function expectAllRowsToBeEmpty (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(TimelineRow)
    expect(item.date).to.eq(undefined)
    expect(item.description).to.eq(undefined)
  })
}

function expectAllRowsToBePopulated (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(!!item.date).to.eq(true)
    expect(!!item.description).to.eq(true)
  })
}
