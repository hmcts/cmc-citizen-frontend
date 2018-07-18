import { expect } from 'chai'

import { ResponseModelConverter } from 'claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import {
  defenceWithDisputeDraft,
  defenceWithAmountClaimedAlreadyPaidDraft,
  fullAdmissionWithImmediatePaymentDraft,
  fullAdmissionWithPaymentBySetDateDraft,
  fullAdmissionWithPaymentByInstalmentsDraft,
  statementOfMeansWithMandatoryFieldsDraft,
  statementOfMeansWithAllFieldsDraft,
  partialAdmissionWithPaymentBySetDateDraft,
  partialAdmissionWithPaymentByInstalmentsDraft,
  partialAdmissionWithImmediatePaymentDraft,
  partialAdmissionAlreadyPaidDraft
} from 'test/data/draft/responseDraft'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from 'test/data/draft/partyDetails'

import { Response } from 'claims/models/response'
import {
  defenceWithDisputeData,
  defenceWithAmountClaimedAlreadyPaidData,
  fullAdmissionWithImmediatePaymentData,
  fullAdmissionWithPaymentBySetDateData,
  fullAdmissionWithPaymentByInstalmentsData,
  statementOfMeansWithMandatoryFieldsOnlyData,
  statementOfMeansWithAllFieldsData,
  partialAdmissionWithPaymentBySetDateData,
  partialAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithImmediatePaymentData,
  partialAdmissionAlreadyPaidData
} from 'test/data/entity/responseData'
import { company, individual, organisation, soleTrader } from 'test/data/entity/party'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'

function prepareResponseDraft (draftTemplate: any, partyDetails: object): ResponseDraft {
  return new ResponseDraft().deserialize({
    ...draftTemplate,
    defendantDetails: { ...draftTemplate.defendantDetails, partyDetails: partyDetails },
    timeline: DefendantTimeline.fromObject({ rows: [], comment: 'I do not agree' })
  })
}

function prepareResponseData (template, party: object): Response {
  return Response.deserialize({
    ...template,
    defendant: { ...party, email: 'user@example.com', mobilePhone: '0700000000' },
    timeline: { rows: [], comment: 'I do not agree' }
  })
}

function preparePartialResponseData (template, party: object): Response {
  return Response.deserialize({
    ...template,
    defendant: { ...party, email: 'user@example.com', mobilePhone: '0700000000' },
    timeline: template.timeline
  })
}

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
}

describe('ResponseModelConverter', () => {
  context('full defence conversion', () => {
    [
      [individualDetails, individual],
      [soleTraderDetails, soleTrader],
      [companyDetails, company],
      [organisationDetails, organisation]
    ].forEach(([partyDetails, party]) => {
      it(`should convert defence with dispute submitted by ${partyDetails.type}`, () => {
        const responseDraft = prepareResponseDraft(defenceWithDisputeDraft, partyDetails)
        const responseData = prepareResponseData(defenceWithDisputeData, party)

        expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
      })

      it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type}`, () => {
        const responseDraft = prepareResponseDraft(defenceWithAmountClaimedAlreadyPaidDraft, partyDetails)
        const responseData = prepareResponseData(defenceWithAmountClaimedAlreadyPaidData, party)

        expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
      })
    })

    it('should not convert payment declaration for defence with dispute', () => {
      const responseDraft = prepareResponseDraft({
        ...defenceWithDisputeDraft,
        whenDidYouPay: {
          date: {
            year: 2017,
            month: 12,
            day: 31
          },
          text: 'I paid in cash'
        }
      }, individualDetails)
      const responseData = prepareResponseData(defenceWithDisputeData, individual)

      expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(responseData)
    })
  })

  context('full admission conversion', () => {
    it('should convert full admission paid immediately', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithImmediatePaymentDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithImmediatePaymentData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by set date', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithPaymentBySetDateDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithPaymentBySetDateData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by set date with mandatory SoM only', () => {
      const responseDraft = prepareResponseDraft({ ...fullAdmissionWithPaymentBySetDateDraft, statementOfMeans: { ...statementOfMeansWithMandatoryFieldsDraft } }, individualDetails)
      const responseData = prepareResponseData({ ...fullAdmissionWithPaymentBySetDateData, statementOfMeans: { ...statementOfMeansWithMandatoryFieldsOnlyData } }, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by instalments', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithPaymentByInstalmentsDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithPaymentByInstalmentsData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by instalments with complete SoM', () => {
      const responseDraft = prepareResponseDraft({ ...fullAdmissionWithPaymentByInstalmentsDraft, statementOfMeans: { ...statementOfMeansWithAllFieldsDraft } }, individualDetails)
      const responseData = prepareResponseData({ ...fullAdmissionWithPaymentByInstalmentsData, statementOfMeans: { ...statementOfMeansWithAllFieldsData } }, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })
  })

  context('partial admission conversion', () => {
    it('should convert already paid partial admission', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionAlreadyPaidDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionAlreadyPaidData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid immediately', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithImmediatePaymentDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithImmediatePaymentData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by set date', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithPaymentBySetDateDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithPaymentBySetDateData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by set date with mandatory SoM only', () => {
      const responseDraft = prepareResponseDraft({ ...partialAdmissionWithPaymentBySetDateDraft, statementOfMeans: { ...statementOfMeansWithMandatoryFieldsDraft } }, individualDetails)
      const responseData = preparePartialResponseData({ ...partialAdmissionWithPaymentBySetDateData, statementOfMeans: { ...statementOfMeansWithMandatoryFieldsOnlyData } }, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by instalments', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithPaymentByInstalmentsDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithPaymentByInstalmentsData, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by instalments with complete SoM', () => {
      const responseDraft = prepareResponseDraft({ ...partialAdmissionWithPaymentByInstalmentsDraft, statementOfMeans: { ...statementOfMeansWithAllFieldsDraft } }, individualDetails)
      const responseData = preparePartialResponseData({ ...partialAdmissionWithPaymentByInstalmentsData, statementOfMeans: { ...statementOfMeansWithAllFieldsData } }, individual)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })
  })
})
