import { expect } from 'chai'

import { ResponseModelConverter } from 'claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import {
  defenceWithAmountClaimedAlreadyPaidDraft,
  defenceWithDisputeDraft,
  fullAdmissionWithImmediatePaymentDraft,
  fullAdmissionWithPaymentByInstalmentsDraft,
  fullAdmissionWithPaymentBySetDateDraft,
  partialAdmissionAlreadyPaidDraft,
  partialAdmissionWithImmediatePaymentDraft,
  partialAdmissionWithPaymentByInstalmentsDraft,
  partialAdmissionWithPaymentBySetDateDraft,
  statementOfMeansWithAllFieldsDraft,
  statementOfMeansWithMandatoryFieldsDraft
} from 'test/data/draft/responseDraft'
import { companyDetails, individualDetails, organisationDetails, soleTraderDetails } from 'test/data/draft/partyDetails'

import { Response } from 'claims/models/response'
import {
  defenceWithDisputeData,
  fullAdmissionWithImmediatePaymentData,
  fullAdmissionWithPaymentByInstalmentsData,
  fullAdmissionWithPaymentBySetDateData,
  partialAdmissionAlreadyPaidData,
  partialAdmissionFromStatesPaidDefence,
  partialAdmissionWithImmediatePaymentData,
  partialAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithPaymentBySetDateData,
  statementOfMeansWithAllFieldsData,
  statementOfMeansWithMandatoryFieldsOnlyData
} from 'test/data/entity/responseData'
import { company, individual, organisation, soleTrader } from 'test/data/entity/party'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { sampleMediationDraftObj } from 'test/http-mocks/draft-store'

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
  const mediationDraft = new MediationDraft().deserialize(sampleMediationDraftObj)

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
        const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

        expect(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)).to.deep.equal(responseData)
      })

      it(`should convert defence with amount claimed already paid submitted by ${partyDetails.type} to partial admission`, () => {
        const responseDraft = prepareResponseDraft(defenceWithAmountClaimedAlreadyPaidDraft, partyDetails)
        const responseData = preparePartialResponseData(partialAdmissionFromStatesPaidDefence, party)
        const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

        expect(Response.deserialize(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
          .to.deep.equal(Response.deserialize(responseData))
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
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)).to.deep.equal(responseData)
    })
  })

  context('full admission conversion', () => {
    it('should convert full admission paid immediately', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithImmediatePaymentDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithImmediatePaymentData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by set date', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithPaymentBySetDateDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithPaymentBySetDateData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by set date with mandatory SoM only', () => {
      const responseDraft = prepareResponseDraft({
        ...fullAdmissionWithPaymentBySetDateDraft,
        statementOfMeans: { ...statementOfMeansWithMandatoryFieldsDraft }
      }, individualDetails)
      const responseData = prepareResponseData({
        ...fullAdmissionWithPaymentBySetDateData,
        statementOfMeans: { ...statementOfMeansWithMandatoryFieldsOnlyData }
      }, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by instalments', () => {
      const responseDraft = prepareResponseDraft(fullAdmissionWithPaymentByInstalmentsDraft, individualDetails)
      const responseData = prepareResponseData(fullAdmissionWithPaymentByInstalmentsData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert full admission paid by instalments with complete SoM', () => {
      const responseDraft = prepareResponseDraft({
        ...fullAdmissionWithPaymentByInstalmentsDraft,
        statementOfMeans: { ...statementOfMeansWithAllFieldsDraft }
      }, individualDetails)
      const responseData = prepareResponseData({
        ...fullAdmissionWithPaymentByInstalmentsData,
        statementOfMeans: { ...statementOfMeansWithAllFieldsData }
      }, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })
  })

  context('partial admission conversion', () => {
    it('should convert already paid partial admission', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionAlreadyPaidDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionAlreadyPaidData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid immediately', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithImmediatePaymentDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithImmediatePaymentData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by set date', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithPaymentBySetDateDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithPaymentBySetDateData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by set date with mandatory SoM only', () => {
      const responseDraft = prepareResponseDraft({
        ...partialAdmissionWithPaymentBySetDateDraft,
        statementOfMeans: { ...statementOfMeansWithMandatoryFieldsDraft }
      }, individualDetails)
      const responseData = preparePartialResponseData({
        ...partialAdmissionWithPaymentBySetDateData,
        statementOfMeans: { ...statementOfMeansWithMandatoryFieldsOnlyData }
      }, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by instalments', () => {
      const responseDraft = prepareResponseDraft(partialAdmissionWithPaymentByInstalmentsDraft, individualDetails)
      const responseData = preparePartialResponseData(partialAdmissionWithPaymentByInstalmentsData, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })

    it('should convert partial admission paid by instalments with complete SoM', () => {
      const responseDraft = prepareResponseDraft({
        ...partialAdmissionWithPaymentByInstalmentsDraft,
        statementOfMeans: { ...statementOfMeansWithAllFieldsDraft }
      }, individualDetails)
      const responseData = preparePartialResponseData({
        ...partialAdmissionWithPaymentByInstalmentsData,
        statementOfMeans: { ...statementOfMeansWithAllFieldsData }
      }, individual)
      const claim: Claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)

      expect(convertObjectLiteralToJSON(ResponseModelConverter.convert(responseDraft, mediationDraft, claim)))
        .to.deep.equal(convertObjectLiteralToJSON(responseData))
    })
  })
})
