import { expect } from 'chai'

import { FeesTableViewHelper, Row } from 'claim/helpers/feesTableViewHelper'

import { FeeRange } from 'fees/models/feeRange'
import { CurrentVersion } from 'fees/models/currentVersion'
import { FlatAmount } from 'fees/models/flatAmount'

describe('FeesTableViewHelper', () => {
  it('should throw an error when issue fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge(undefined, [])).to.throw(Error, 'Both fee sets are required for merge')
  })

  it('should throw an error when hearing fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge([], undefined)).to.throw(Error, 'Both fee sets are required for merge')
  })

  describe('should merge two arrays', () => {
    it('of the same size', () => {
      const firstFeesSet: FeeRange[] = [
        new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 1', 'approved', new FlatAmount(25))),
        new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35)))
      ]
      const secondFeesSet: FeeRange[] = [
        new FeeRange(0.01, 300, new CurrentVersion('HF1', 'Hearing fee - band 1', 'approved', new FlatAmount(25))),
        new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(55)))
      ]
      const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
      expect(result).to.have.lengthOf(2)
      expect(result).to.have.deep.members([
        new Row(0.01, 300, { 1: '25', 2: '25' }),
        new Row(300.01, 500, { 1: '35', 2: '55' })
      ])
    })

    describe('of different sizes', () => {
      it('when first band is missing from first array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35)))
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('HF1', 'Hearing fee - band 1', 'approved', new FlatAmount(25))),
          new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(55)))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 2: '25' }),
          new Row(300.01, 500, { 1: '35', 2: '55' })
        ])
      })

      it('when second band is missing from first array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(25)))
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('HF1', 'Hearing fee - band 1', 'approved', new FlatAmount(25))),
          new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(55)))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: '25', 2: '25' }),
          new Row(300.01, 500, { 2: '55' })
        ])
      })

      it('when first band is missing from second array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 1', 'approved', new FlatAmount(25))),
          new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35)))
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(55)))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: '25' }),
          new Row(300.01, 500, { 1: '35', 2: '55' })
        ])
      })

      it('when second band is missing from second array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 1', 'approved', new FlatAmount(25))),
          new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35)))
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, new CurrentVersion('HF2', 'Hearing fee - band 1', 'approved', new FlatAmount(25)))
        ]

        const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new Row(0.01, 300, { 1: '25', 2: '25' }),
          new Row(300.01, 500, { 1: '35' })
        ])
      })
    })
  })

  it('should merge two arrays when ranges are misaligned', () => {
    const firstFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 1', 'approved', new FlatAmount(25))),
      new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35)))
    ]
    const secondFeesSet: FeeRange[] = [
      new FeeRange(0.01, 100, new CurrentVersion('HF2', 'Hearing fee - band 1', 'approved', new FlatAmount(15))),
      new FeeRange(100.01, 300, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(35))),
      new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 3', 'approved', new FlatAmount(55)))
    ]
    const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(3)
    expect(result).to.have.deep.members([
      new Row(0.01, 100, { 1: '25', 2: '15' }),
      new Row(100.01, 300, { 1: '25', 2: '35' }),
      new Row(300.01, 500, { 1: '35', 2: '55' })
    ])
  })

  it('should merge two fee arrays used in real life', () => {

    const firstFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, new CurrentVersion('1.0', 'Issue fee - band 1', 'approved', new FlatAmount(25))),
      new FeeRange(300.01, 500, new CurrentVersion('1.0', 'Issue fee - band 2', 'approved', new FlatAmount(35))),
      new FeeRange(500.01, 1000, new CurrentVersion('1.0', 'Issue fee - band 3', 'approved', new FlatAmount(60))),
      new FeeRange(1000.01, 1500, new CurrentVersion('1.0', 'Issue fee - band 4', 'approved', new FlatAmount(70))),
      new FeeRange(1500.01, 3000, new CurrentVersion('1.0', 'Issue fee - band 5', 'approved', new FlatAmount(105))),
      new FeeRange(3000.01, 5000, new CurrentVersion('1.0', 'Issue fee - band 6', 'approved', new FlatAmount(185))),
      new FeeRange(5000.01, 10000, new CurrentVersion('1.0', 'Issue fee - band 7', 'approved', new FlatAmount(410)))
    ]
    const secondFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, new CurrentVersion('HF2', 'Hearing fee - band 1', 'approved', new FlatAmount(25))),
      new FeeRange(300.01, 500, new CurrentVersion('HF2', 'Hearing fee - band 2', 'approved', new FlatAmount(55))),
      new FeeRange(500.01, 1000, new CurrentVersion('HF2', 'Hearing fee - band 3', 'approved', new FlatAmount(80))),
      new FeeRange(1000.01, 1500, new CurrentVersion('HF2', 'Hearing fee - band 3', 'approved', new FlatAmount(115))),
      new FeeRange(1500.01, 3000, new CurrentVersion('HF2', 'Hearing fee - band 3', 'approved', new FlatAmount(170))),
      new FeeRange(3000.01, 10000, new CurrentVersion('HF2', 'Hearing fee - band 3', 'approved', new FlatAmount(335)))
    ]

    const result: Row[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(7)
    expect(result).to.have.deep.members([
      new Row(0.01, 300, { 1: '25', 2: '25' }),
      new Row(300.01, 500, { 1: '35', 2: '55' }),
      new Row(500.01, 1000, { 1: '60', 2: '80' }),
      new Row(1000.01, 1500, { 1: '70', 2: '115' }),
      new Row(1500.01, 3000, { 1: '105', 2: '170' }),
      new Row(3000.01, 5000, { 1: '185', 2: '335' }),
      new Row(5000.01, 10000, { 1: '410', 2: '335' })
    ])
  })
})
