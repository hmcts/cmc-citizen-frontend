import { expect } from 'chai'

import { EvidenceRow } from 'forms/models/evidenceRow'
import { Evidence, INIT_ROW_COUNT } from 'forms/models/evidence'
import { EvidenceType } from 'forms/models/evidenceType'
import { MAX_NUMBER_OF_ROWS } from 'forms/models/multiRowForm'

describe('Evidence', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of EvidenceRow`, () => {

      const actual: EvidenceRow[] = (new Evidence()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = Evidence.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return Evidence with list of empty EvidenceRow[] when empty input given', () => {
      const actual: Evidence = Evidence.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Evidence with first element on list populated', () => {
      const actual: Evidence = Evidence.fromObject({ rows: [{ type: EvidenceType.OTHER.value, description: 'OK' }] })

      const populatedItem: EvidenceRow = actual.rows.pop()

      expect(populatedItem.type.value).to.eq('OTHER')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of EvidenceRow longer than default', () => {
      const actual: Evidence = Evidence.fromObject({
        rows: [
          { type: EvidenceType.OTHER.value, description: 'OK' },
          { type: EvidenceType.OTHER.value, description: 'OK' },
          { type: EvidenceType.OTHER.value, description: 'OK' },
          { type: EvidenceType.OTHER.value, description: 'OK' },
          { type: EvidenceType.OTHER.value, description: 'OK' }
        ]
      })

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid Evidence object with list of empty EvidenceRow', () => {
      const actual: Evidence = new Evidence().deserialize({}) as Evidence

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid Evidence object with populated first EvidenceRow', () => {
      const actual: Evidence = new Evidence().deserialize({ rows: [item()] }) as Evidence

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      const populatedItem: EvidenceRow = actual.rows[0]

      expect(populatedItem.type.value).to.eq('OTHER')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows.slice(1))
    })

    it('should return valid Evidence object with list of row longer than default length', () => {
      const actual: Evidence = new Evidence().deserialize({ rows: [item(), item(), item(), item(), item()] }) as Evidence

      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('appendRow', () => {

    it('adds empty element to list of rows', () => {
      const actual: Evidence = new Evidence()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })

    it(`adds only up to ${MAX_NUMBER_OF_ROWS} elements`, () => {
      const actual: Evidence = new Evidence()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      for (let i = 0; i < MAX_NUMBER_OF_ROWS + 1; i++) {
        actual.appendRow()
      }

      expect(actual.rows.length).to.be.eq(MAX_NUMBER_OF_ROWS)
    })
  })

  describe('removeExcessRows', () => {

    it('should filter out all elements from list when empty', () => {
      const actual: Evidence = new Evidence()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(0)
    })

    it('should not filter out any element from list when all populated', () => {
      const actual: Evidence = new Evidence().deserialize({
        rows: [item(), item(), item(), item(), item()]
      }) as Evidence

      expect(actual.rows.length).to.be.eq(5)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(5)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when some of them are populated', () => {
      const actual: Evidence = new Evidence().deserialize({
        rows: [item(), item(), {}, {}]
      }) as Evidence

      expect(actual.rows.length).to.be.eq(4)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(2)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when mixed', () => {
      const actual: Evidence = new Evidence().deserialize({
        rows: [item(), {}, item(), {}]
      }) as Evidence

      expect(actual.rows.length).to.be.eq(4)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(2)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('canAddMoreRows', () => {

    it('should return true when number of elements is lower than max number', () => {
      const actual: Evidence = new Evidence()

      expect(actual.canAddMoreRows()).to.be.eq(true)
    })

    it('should return true when number of rows is equal max', () => {
      const actual: Evidence = new Evidence()

      for (let i = 0; i < MAX_NUMBER_OF_ROWS; i++) {
        actual.appendRow()
      }

      expect(actual.canAddMoreRows()).to.be.eq(false)
    })
  })

  describe('isCompleted', () => {

    context('should return true when ', () => {

      it('rows is an empty array', () => {
        const actual: Evidence = new Evidence([])

        expect(actual.isCompleted()).to.be.eq(true)
      })

      it('rows is populated array', () => {
        const actual: Evidence = new Evidence().deserialize({ rows: [item()] }) as Evidence

        expect(actual.isCompleted()).to.be.eq(true)
      })
    })

    it('should return false when rows is undefined', () => {
      const actual: Evidence = new Evidence()

      delete actual.rows

      expect(actual.isCompleted()).to.be.eq(false)
    })
  })
})

function item (type: string = EvidenceType.OTHER.value, desc: string = 'OK'): object {
  return { type: { value: type }, description: desc }
}

function expectAllRowsToBeEmpty (rows: EvidenceRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(EvidenceRow)
    expect(item.isEmpty()).to.eq(true)
  })
}

function expectAllRowsToBePopulated (rows: EvidenceRow[]) {
  rows.forEach(item => {
    expect(!!item.type).to.eq(true)
    expect(!!item.description).to.eq(true)
  })
}
