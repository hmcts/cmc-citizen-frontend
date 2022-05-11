import { expect } from 'chai'

import { KeywordHearingEventUtils } from 'utils/keywordHearingEventUtils'

describe('KeywordHearingEventUtils', () => {

  it('should return correct keyword based on amount when given lower limit', () => {
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(0.01)).to.eq('HearingFeeUpTo300')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(300.01)).to.eq('HearingFeeUpTo500')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(500.01)).to.eq('HearingFeeUpTo1000')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(1000.01)).to.eq('HearingFeeUpTo1500')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(1500.01)).to.eq('HearingFeeUpTo3k')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(3000.01)).to.eq('HearingFeeAbove3k')
  })

  it('should return correct keyword based on amount when given upper limit, upper limit for HearingFeeAbove3k specified as 10,000', () => {
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(300)).to.eq('HearingFeeUpTo300')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(500)).to.eq('HearingFeeUpTo500')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(1000)).to.eq('HearingFeeUpTo1000')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(1500)).to.eq('HearingFeeUpTo1500')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(3000)).to.eq('HearingFeeUpTo3k')
    expect(KeywordHearingEventUtils.getKeywordHearingEvent(10000)).to.eq('HearingFeeAbove3k')
  })
})
