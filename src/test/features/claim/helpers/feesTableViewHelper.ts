import { expect } from 'chai'

import { FeesTableViewHelper, Row } from 'claim/helpers/feesTableViewHelper'

import { Range } from 'fees/models/range'
import { Fee } from 'fees/models/fee'

describe('FeesTableViewHelper', () => {
  it('should throw an error when issue fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge(undefined, [])).to.throw(Error, 'Both fee sets are required for merge')
  })

  it('should throw an error when hearing fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge([], undefined)).to.throw(Error, 'Both fee sets are required for merge')
  })

  describe('should merge two arrays', () => {
    it('of the same size', () => {
      const firstFeesSet: Range[] = [
        new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed')),
        new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed'))
      ]
      const secondFeesSet: Range[] = [
        new Range(0.01, 300, new Fee('HF1', 'Hearing fee - band 1', 25, 'fixed')),
        new Range(300.01, 500, new Fee('HF2', 'Hearing fee - band 2', 55, 'fixed'))
      ]

      const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
      expect(result).to.have.lengthOf(2)
      expect(result).to.have.deep.members([
        new Row(0.01, 300, { 1: 25, 2: 25 }),
        new Row(300.01, 500, { 1: 35, 2: 55 })
      ])
    })

    describe('of different sizes', () => {
      it('when first band is missing from first array', () => {
        const firstFeesSet: Range[] = [
          new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed'))
        ]
        const secondFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('HF1', 'Hearing fee - band 1', 25, 'fixed')),
          new Range(300.01, 500, new Fee('HF2', 'Hearing fee - band 2', 55, 'fixed'))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 2: 25 }),
          new Row(300.01, 500, { 1: 35, 2: 55 })
        ])
      })

      it('when second band is missing from first array', () => {
        const firstFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed'))
        ]
        const secondFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('HF1', 'Hearing fee - band 1', 25, 'fixed')),
          new Range(300.01, 500, new Fee('HF2', 'Hearing fee - band 2', 55, 'fixed'))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: 25, 2: 25 }),
          new Row(300.01, 500, { 2: 55 })
        ])
      })

      it('when first band is missing from second array', () => {
        const firstFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed')),
          new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed'))
        ]
        const secondFeesSet: Range[] = [
          new Range(300.01, 500, new Fee('HF2', 'Hearing fee - band 2', 55, 'fixed'))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: 25 }),
          new Row(300.01, 500, { 1: 35, 2: 55 })
        ])
      })

      it('when second band is missing from second array', () => {
        const firstFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed')),
          new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed'))
        ]
        const secondFeesSet: Range[] = [
          new Range(0.01, 300, new Fee('HF1', 'Hearing fee - band 1', 25, 'fixed'))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: 25, 2: 25 }),
          new Row(300.01, 500, { 1: 35 })
        ])
      })
    })
  })

  it('should merge two arrays when ranges are misaligned', () => {
    const firstFeesSet: Range[] = [
      new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed')),
      new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed'))
    ]
    const secondFeesSet: Range[] = [
      new Range(0.01, 100, new Fee('HF1', 'Hearing fee - band 1', 15, 'fixed')),
      new Range(100.01, 300, new Fee('HF2', 'Hearing fee - band 2', 35, 'fixed')),
      new Range(300.01, 500, new Fee('HF3', 'Hearing fee - band 3', 55, 'fixed'))
    ]

    const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(3)
    expect(result).to.have.deep.members([
      new Row(0.01, 100, { 1: 25, 2: 15 }),
      new Row(100.01, 300, { 1: 25, 2: 35 }),
      new Row(300.01, 500, { 1: 35, 2: 55 })
    ])
  })

  it('should merge two fee arrays used in real life', () => {
    const firstFeesSet: Range[] = [
      new Range(0.01, 300, new Fee('IF1', 'Issue fee - band 1', 25, 'fixed')),
      new Range(300.01, 500, new Fee('IF2', 'Issue fee - band 2', 35, 'fixed')),
      new Range(500.01, 1000, new Fee('IF3', 'Issue fee - band 3', 60, 'fixed')),
      new Range(1000.01, 1500, new Fee('IF4', 'Issue fee - band 4', 70, 'fixed')),
      new Range(1500.01, 3000, new Fee('IF5', 'Issue fee - band 5', 105, 'fixed')),
      new Range(3000.01, 5000, new Fee('IF6', 'Issue fee - band 6', 185, 'fixed')),
      new Range(5000.01, 10000, new Fee('IF7', 'Issue fee - band 7', 410, 'fixed'))
    ]
    const secondFeesSet: Range[] = [
      new Range(0.01, 300, new Fee('HF1', 'Hearing fee - band 1', 25, 'fixed')),
      new Range(300.01, 500, new Fee('HF2', 'Hearing fee - band 2', 55, 'fixed')),
      new Range(500.01, 1000, new Fee('HF3', 'Hearing fee - band 3', 80, 'fixed')),
      new Range(1000.01, 1500, new Fee('HF4', 'Hearing fee - band 4', 115, 'fixed')),
      new Range(1500.01, 3000, new Fee('HF5', 'Hearing fee - band 5', 170, 'fixed')),
      new Range(3000.01, 10000, new Fee('HF6', 'Hearing fee - band 5', 335, 'fixed'))
    ]

    const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(7)
    expect(result).to.have.deep.members([
      new Row(0.01, 300, { 1: 25, 2: 25 }),
      new Row(300.01, 500, { 1: 35, 2: 55 }),
      new Row(500.01, 1000, { 1: 60, 2: 80 }),
      new Row(1000.01, 1500, { 1: 70, 2: 115 }),
      new Row(1500.01, 3000, { 1: 105, 2: 170 }),
      new Row(3000.01, 5000, { 1: 185, 2: 335 }),
      new Row(5000.01, 10000, { 1: 410, 2: 335 })
    ])
  })
})
