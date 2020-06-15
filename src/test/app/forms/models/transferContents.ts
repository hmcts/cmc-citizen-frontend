/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { TransferContents } from 'claims/models/transferContents'

describe('TransferContents', () => {

  describe('constructor', () => {

    it('should set the primitive fields to undefined', () => {
      let transferContents = new TransferContents()
      expect(transferContents.dateOfTransfer).to.be.undefined
      expect(transferContents.reasonForTransfer).to.be.undefined
      expect(transferContents.hearingCourtName).to.be.undefined
      expect(transferContents.hearingCourtAddress).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return a TransferContents instance initialised with defaults for undefined', () => {
      expect(new TransferContents().deserialize(undefined)).to.eql(new TransferContents())
    })

    it('should return a TransferContents instance initialised with defaults for null', () => {
      expect(new TransferContents().deserialize(null)).to.eql(new TransferContents())
    })

    it('should return a TransferContents instance with set field "dateOfTransfer" from given object', () => {
      let result = new TransferContents().deserialize({
        dateOfTransfer: '2020-01-01'
      })
      expect(result.dateOfTransfer.year()).to.be.equals(2020)
      expect(result.dateOfTransfer.month()).to.be.equals(1)
      expect(result.dateOfTransfer.day()).to.be.equals(1)
    })

    it('should return a TransferContents instance with set field "reasonForTransfer" from given object', () => {
      let result = new TransferContents().deserialize({
        reasonForTransfer: 'Reason'
      })
      expect(result.reasonForTransfer).to.be.equals('Reason')
    })

    it('should return a TransferContents instance with set field "hearingCourtName" from given object', () => {
      let result = new TransferContents().deserialize({
        hearingCourtName: 'Hearing Court Name'
      })
      expect(result.hearingCourtName).to.be.equals('Hearing Court Name')
    })

    it('should return a TransferContents instance with set field "hearingCourtAddress" from given object', () => {
      let result = new TransferContents().deserialize({
        hearingCourtAddress: {
          line1: 'first line',
          postcode: 'bb127nq'
        }
      })
      expect(result.hearingCourtAddress.line1).to.be.equals('first line')
      expect(result.hearingCourtAddress.postcode).to.be.equals('bb127nq')
    })
  })
})
