import { expect } from 'chai'

import { FeeRange, FeesTableViewHelper, FeeRangeMerge } from 'claim/helpers/feesTableViewHelper'
import * as feesServiceMock from 'test/http-mocks/fees'
import { mock, reset } from 'ts-mockito'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { FeatureToggles } from 'utils/featureToggles'
import * as sinon from 'sinon'

const mockLaunchDarklyClient: LaunchDarklyClient = mock(LaunchDarklyClient)

describe('FeesTableViewHelper', () => {
  let newClaimFeesEnabledStub: sinon.SinonStub

  beforeEach(() => {
    newClaimFeesEnabledStub = sinon.stub(FeatureToggles.prototype, 'isNewClaimFeesEnabled')
  })

  afterEach(() => {
    reset(mockLaunchDarklyClient)
    newClaimFeesEnabledStub.restore()
  })

  it('should throw an error when issue fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge(undefined, [])).to.throw(Error, 'Both fee sets are required for merge')
  })

  it('should throw an error when hearing fees array is undefined', () => {
    expect(() => FeesTableViewHelper.merge([], undefined)).to.throw(Error, 'Both fee sets are required for merge')
  })

  describe('should merge two arrays', () => {
    it('of the same size', () => {
      const firstFeesSet: FeeRange[] = [
        new FeeRange(0.01, 300, 25),
        new FeeRange(300.01, 500, 35)
      ]
      const secondFeesSet: FeeRange[] = [
        new FeeRange(0.01, 300, 25),
        new FeeRange(300.01, 500, 55)
      ]
      const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
      expect(result).to.have.lengthOf(2)
      expect(result).to.have.deep.members([
        new FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
        new FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
      ])
    })

    describe('of different sizes', () => {
      it('when first band is missing from first array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(300.01, 500, 35)
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25),
          new FeeRange(300.01, 500, 55)
        ]

        const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new FeeRangeMerge(0.01, 300, { 2: 25 }),
          new FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
        ])
      })

      it('when second band is missing from first array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25)
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25),
          new FeeRange(300.01, 500, 55)
        ]

        const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
          new FeeRangeMerge(300.01, 500, { 2: 55 })
        ])
      })

      it('when first band is missing from second array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25),
          new FeeRange(300.01, 500, 35)
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(300.01, 500, 55)
        ]

        const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new FeeRangeMerge(0.01, 300, { 1: 25 }),
          new FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
        ])
      })

      it('when second band is missing from second array', () => {

        const firstFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25),
          new FeeRange(300.01, 500, 35)
        ]
        const secondFeesSet: FeeRange[] = [
          new FeeRange(0.01, 300, 25)
        ]

        const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
        expect(result).to.have.lengthOf(2)
        expect(result).to.have.deep.members([
          new FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
          new FeeRangeMerge(300.01, 500, { 1: 35 })
        ])
      })
    })
  })

  it('should merge two arrays when ranges are misaligned', () => {
    const firstFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, 25),
      new FeeRange(300.01, 500, 35)
    ]
    const secondFeesSet: FeeRange[] = [
      new FeeRange(0.01, 100, 15),
      new FeeRange(100.01, 300, 35),
      new FeeRange(300.01, 500, 55)
    ]
    const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(3)
    expect(result).to.have.deep.members([
      new FeeRangeMerge(0.01, 100, { 1: 25, 2: 15 }),
      new FeeRangeMerge(100.01, 300, { 1: 25, 2: 35 }),
      new FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
    ])
  })

  it('should merge two fee arrays used in real life', () => {

    const firstFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, 25),
      new FeeRange(300.01, 500, 35),
      new FeeRange(500.01, 1000, 60),
      new FeeRange(1000.01, 1500, 70),
      new FeeRange(1500.01, 3000, 105),
      new FeeRange(3000.01, 5000, 185),
      new FeeRange(5000.01, 10000, 410)
    ]
    const secondFeesSet: FeeRange[] = [
      new FeeRange(0.01, 300, 25),
      new FeeRange(300.01, 500, 55),
      new FeeRange(500.01, 1000, 80),
      new FeeRange(1000.01, 1500, 115),
      new FeeRange(1500.01, 3000, 170),
      new FeeRange(3000.01, 10000, 335)
    ]

    const result: FeeRangeMerge[] = FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01)
    expect(result).to.have.lengthOf(7)
    expect(result).to.have.deep.members([
      new FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
      new FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 }),
      new FeeRangeMerge(500.01, 1000, { 1: 60, 2: 80 }),
      new FeeRangeMerge(1000.01, 1500, { 1: 70, 2: 115 }),
      new FeeRangeMerge(1500.01, 3000, { 1: 105, 2: 170 }),
      new FeeRangeMerge(3000.01, 5000, { 1: 185, 2: 335 }),
      new FeeRangeMerge(5000.01, 10000, { 1: 410, 2: 335 })
    ])
  })

  it('should filter out older versions of fee and get only latest', async () => {
    newClaimFeesEnabledStub.returns(false)
    feesServiceMock.resolveGetIssueFeeRangeGroup()
    feesServiceMock.resolveGetHearingFeeRangeGroup()

    const result: FeeRangeMerge[] = await FeesTableViewHelper.feesTableContent()
    expect(result).to.have.lengthOf(2)
  })

  it('should filter out older versions of fee and get only new claim fees', async () => {
    newClaimFeesEnabledStub.returns(true)
    feesServiceMock.resolveGetIssueFeeRangeGroupDefaultChannel()
    feesServiceMock.resolveGetHearingFeeRangeGroup()

    const result: FeeRangeMerge[] = await FeesTableViewHelper.feesTableContent()
    expect(result).to.have.lengthOf(2)
  })

  it('should filter out older versions of fee and get only new claim fees for counterclaim', async () => {
    newClaimFeesEnabledStub.returns(true)
    feesServiceMock.resolveGetIssueFeeRangeGroupDefaultChannel()

    const result: FeeRange[] = await FeesTableViewHelper.claimFeesOnlyTableContent()
    expect(result).to.have.lengthOf(2)
  })
})
